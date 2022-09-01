import {Service} from 'fastify-decorators';
import {trimStrings} from '../../utils/trimStrings';
import {PasswordService} from '../../shared/services/password.service';
import {TokenService} from '../../shared/services/token.service';
import {MailService} from '../../shared/services/mail.service';
import {UserService} from '../user/user.service';
import {Unauthorized, BadRequest, InternalServerError} from 'http-errors';
import {
  LoginType,
  RegisterType,
  ChangePasswordType,
  ForgotPasswordType,
  NewPasswordType,
  RefreshTokenType,
} from './auth.schema';

@Service('AuthServiceToken')
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly passwordService: PasswordService,
  ) {}

  async logIn(data: LoginType) {
    const [username] = trimStrings(data.username);

    const user = await this.userService.getByUsername(username);

    if (!user) {
      throw new Unauthorized('invalid_credentials');
    }

    if (!this.passwordService.isValidPassword(data.password)) {
      throw new BadRequest('invalid_password');
    }

    if (!(await this.passwordService.verify(user.password, data.password))) {
      throw new Unauthorized('invalid_credentials');
    }

    const {accessToken, refreshToken} = this.tokenService.generateTokens({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    });

    try {
      await this.userService.updateRefreshToken(user.id, refreshToken);
    } catch (error) {
      throw new InternalServerError();
    }

    const {
      password,
      refreshToken: _refreshToken,
      resetPasswordToken,

      ...restOfUser
    } = user;

    return {
      accessToken,
      refreshToken,
      user: {
        ...restOfUser,

        favoritesCount: restOfUser.favorites.length,
        photosCount: restOfUser.photos.length,
        galleryCount: restOfUser.gallery.length,
      },
    };
  }

  async register(data: RegisterType) {
    const [address, email, name, birthDate, username] = trimStrings(
      data.address,
      data.email,
      data.name,
      data.birthDate,
      data.username,
    );

    // const age = calcAgeFromDate(new Date(birthDate));

    // if (age < 18) {
    // 	throw new Unauthorized('under_age');
    // }

    const foundUser = await this.userService.getByUsername(username);

    if (foundUser) {
      throw new BadRequest('account_taken');
    }

    const newUser = await this.userService.create({
      username,
      description: data.description,
      address,
      birthDate,
      email,
      name,
      password: data.password,
    });

    const {accessToken, refreshToken} = this.tokenService.generateTokens({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
    });

    try {
      await this.userService.updateRefreshToken(newUser.id, refreshToken);
    } catch (error) {
      throw new InternalServerError();
    }

    const {
      password,
      refreshToken: _refreshToken,
      resetPasswordToken,
      ...restOfUser
    } = newUser;

    return {
      accessToken,
      refreshToken,
      user: {
        ...restOfUser,

        favoritesCount: 0,
        photosCount: 0,
        galleryCount: 0,
        favorites: [],
        photos: [],
        gallery: [],
      },
    };
  }

  async forgotPassword({username}: ForgotPasswordType) {
    const user = await this.userService.getByUsername(username);

    if (!user) {
      throw new Unauthorized();
    }

    const resetPasswordToken = this.tokenService.generateForgotPasswordToken({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    });

    try {
      // TODO: cambiar mensaje
      await this.mailService.sendEmail({
        from: '"Recuperar Contraseña ⚡" <wiwi.max.pe@gmail.com>',
        to: user.email,
        subject: 'Recuperación de Contraseña ⚡',
        html: `<b>Clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso:</b><a href="https://admin.fastly.delivery/new-password/${resetPasswordToken}" target="_blank">https://admin.fastly.delivery/new-password/${resetPasswordToken}</a>`,
      });
    } catch (error) {
      console.log('error al enviar el correo', error);
      throw new InternalServerError();
    }

    try {
      await this.userService.updateResetPasswordToken(
        user.id,
        resetPasswordToken,
      );
    } catch (error) {
      throw new InternalServerError();
    }

    return {
      statusCode: 200,
      message: 'Verifica tu correo para resetear tu contraseña',
      success: true,
      // TODO: borrar esto, solo me servirá de prueba
      link: `https://admin.fastly.delivery/new-password/${resetPasswordToken}`,
      resetPasswordToken,
    };
  }

  async newPassword({newPassword, resetPasswordToken}: NewPasswordType) {
    const decoded =
      this.tokenService.verifyForgotPasswordToken(resetPasswordToken);

    const user = await this.userService.getByIdOrThrow(decoded.id);

    if (
      user.resetPasswordToken &&
      user.resetPasswordToken !== resetPasswordToken
    ) {
      throw new Unauthorized();
    }

    if (!this.passwordService.isValidPassword(newPassword)) {
      throw new BadRequest('invalid_password');
    }

    const hashedPassword = await this.passwordService.hash(newPassword);

    try {
      await this.userService.updatePassword(user.id, hashedPassword);
    } catch (error) {
      throw new InternalServerError();
    }

    return {
      statusCode: 200,
      message: 'Password changed',
      success: true,
    };
  }

  async changePassword(
    userId: string,
    {oldPassword, newPassword}: ChangePasswordType,
  ) {
    const user = await this.userService.getById(userId);

    if (!user) {
      throw new Unauthorized();
    }

    if (
      !this.passwordService.isValidPassword(oldPassword) ||
      !this.passwordService.isValidPassword(newPassword)
    ) {
      throw new BadRequest('invalid_password');
    }

    if (!(await this.passwordService.verify(user.password, oldPassword))) {
      throw new Unauthorized('invalid_credentials');
    }

    const hashedPassword = await this.passwordService.hash(newPassword);

    try {
      await this.userService.updatePassword(user.id, hashedPassword);
    } catch (error) {
      throw new InternalServerError();
    }

    return {
      statusCode: 200,
      message: 'Password changed',
      success: true,
    };
  }

  async refreshToken({refreshToken}: RefreshTokenType) {
    const decoded = this.tokenService.verifyRefreshToken(refreshToken);

    const user = await this.userService.getByIdOrThrow(decoded.id);

    const accessToken = this.tokenService.generateAccessToken({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    });

    return {
      statusCode: 200,
      accessToken,
      refreshToken,
      success: true,
    };
  }

  async logOut(id: string) {
    const user = await this.userService.getByIdOrThrow(id);

    try {
      await this.userService.updateRefreshToken(user.id, null);
    } catch (error) {
      throw new InternalServerError();
    }

    return {
      statusCode: 200,
      success: true,
    };
  }
}

import {Service, Initializer} from 'fastify-decorators';
import {ConfigService} from '../../config/config.service';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import internal from 'stream';

@Service('MailServiceToken')
export class MailService {
  private readonly nodemailer: typeof nodemailer = nodemailer;

  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor(private readonly configService: ConfigService) {}

  @Initializer()
  init(): void {
    this.transporter = this.nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('MAILER_TRANSPORTER_HOST'),
      port: +this.configService.getOrThrow<number>('MAILER_TRANSPORTER_PORT'),
      secure: this.configService.getOrThrow<boolean>(
        'MAILER_TRANSPORTER_SECURE',
      ),
      auth: {
        user: this.configService.getOrThrow<string>('MAILER_TRANSPORTER_USER'),
        pass: this.configService.getOrThrow<string>('MAILER_TRANSPORTER_PASS'),
      },
    });
  }

  async sendEmail({
    from,
    to,
    subject,
    html,
  }: {
    from: string | Mail.Address;
    to: string | Mail.Address | (string | Mail.Address)[];
    subject: string;
    html: string | Buffer | internal.Readable | Mail.AttachmentLike;
  }) {
    return this.transporter.sendMail({
      from,
      to,
      subject,
      html,
    });
  }
}

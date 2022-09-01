import Server from './server';
import {serverHost} from './constants/app';

async function bootstrap() {
	let startTime = Date.now();
	const server = await Server({     logger: true,
    disableRequestLogging: true,
    ignoreTrailingSlash: true, });
	let endTime = Date.now();

	if (!!(require.main && module.children)) {
		server.log.info(
			`Server took ${Math.floor(endTime - startTime)}ms to start`
		);
		server.log.info(
			`Developed by @Shair17 <hello@shair.dev>, https://shair.dev`
		);

    await server.listen(+server.config.PORT, serverHost);
	}
}

bootstrap();

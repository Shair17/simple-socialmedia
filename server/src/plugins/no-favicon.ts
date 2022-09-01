import {FastifyPluginAsync} from 'fastify';
// import { StatusCodes } from 'http-status-codes';

const NoFavicon: FastifyPluginAsync = async (server, options) => {
  // server.get('/favicon.ico', (_, reply) => {
  //   reply.code(StatusCodes.NOT_FOUND).send();
  // });
};

export default NoFavicon;

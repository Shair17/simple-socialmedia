import {FastifyPluginAsync} from 'fastify';

const MapRoutes: FastifyPluginAsync = async (server, options) => {
  let routes: Object[] = [];

  for (let [path, route] of server.routes) {
    server.log.info(`Mapped {${path}, ${route[0].method}} route`);
    routes.push({
      method: route[0].method,
      url: route[0].url,
      path: {
        // @ts-ignore
        prefix: route[0].prefix || '/',
        // @ts-ignore
        routePath: route[0].routePath || '/',
      },
    });
  }

  server.get('/routes', async () => {
    return {
      ...routes,
    };
  });
};

export default MapRoutes;

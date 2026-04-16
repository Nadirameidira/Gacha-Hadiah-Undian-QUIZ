const { env, port } = require('./core/config');
const logger = require('./core/logger')('app');
const server = require('./core/server');
const routes = require('./api/routes');
const gachaService = require('./api/components/mengacha/gacha-service');

const app = server.listen(port, (err) => {
  if (err) {
    logger.fatal(err, 'Failed to start the server.');
    process.exit(1);
  } else {
    logger.info(`Server runs at port ${port} in ${env} environment`);
    gachaService
      .init()
      .then(() => {
        logger.info('LETS GO GAMBLING!');
      })
      .catch((error) => {
        logger.error(error, 'Failed to init Gacha system t^t');
      });
  }
});

routes(app);

process.on('uncaughtException', (err) => {
  logger.fatal(err, 'Uncaught exception.');
  app.close(() => process.exit(1));
  setTimeout(() => process.abort(), 1000).unref();
  process.exit(1);
});

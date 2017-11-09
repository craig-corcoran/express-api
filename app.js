const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const promiseRetry = require('promise-retry');
const { loggingMiddleware, logger } = require('@new-knowledge/logger');
const { notFound, requestErrorHandler } = require('./controllers/errors');
const { connect } = require('./controllers/quorumDatabase');
const index = require('./routes/index');

const app = express();

app.use(loggingMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// try to connect to data sink db w/ exponential retry
logger.info('starting to connect to db');
const numRetries = process.env.NUM_RETRIES || 20;
const retryOptions = { retries: numRetries };
promiseRetry(retryOptions, function (retry, number) {
  logger.debug(`connecting to db attempt number ${number} of ${numRetries}`);
  return connect()
    .catch(err => {
      logger.debug(`failed to connect to db, error: ${err.message}`);
      retry(err);
    });
})
  .then(() => {
    logger.info('completed connection to db');
    const port = process.env.API_PORT || 3000;
    app.listen(port, () => console.log(`listening to port ${port}`));
    app.use('/', index);
    app.use(notFound);
    app.use(requestErrorHandler);
  })
  .catch(err => {
    logger.error(`failed to connect to db, error: ${err}`);
  });

module.exports = app;

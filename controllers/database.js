// const { MongoClient } = require('mongodb');
const { logger } = require('@new-knowledge/logger');


let db;
let collection;

async function connect() {
  const host = process.env.HOST || 'localhost';
  const port = process.env.PORT || 27017;
  const databaseName = process.env.DB_NAME || 'db';

  // db = await MongoClient.connect(`mongodb://${host}:${port}/${databaseName}`);
  // collection = db.collection('collectionName');
};


async function routeFunction(routeParam, queryParam) {
  logger.info('route hit');
  return [{ a: 1 }, { a: 2 }];
}


module.exports = {
  connect,
  routeFunction,
};

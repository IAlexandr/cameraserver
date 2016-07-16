import mongoose from 'mongoose';
import options from './../../../options';
import dbCollections from './../db-collections';

console.time('mongodb');
const db = mongoose.createConnection(options.mongoDbUrl);
db.mongoose = mongoose;

Object.keys(dbCollections).forEach((key) => {
  const colName = dbCollections[key].name;
  db[colName] = db.model(colName, dbCollections[key].schema);
});

export default db;
console.timeEnd('mongodb');

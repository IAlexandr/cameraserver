import {dbType} from './../../options';
import nedb from './nedb';
import { default as mongo } from './mongo';
import dbseed from './dbseed';

let db;

switch (options.dbType) {
  case "mongodb" ||  "mongo":
    db = mongo;
    break;
  case "nedb":
    db = nedb;
    break;
  default:
    throw new Error('options.dbType not supported');
    break;
}

dbseed(db);
export default db;

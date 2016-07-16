import db from './db';
import dbCollections from './../db-collections';

// todo не все методы проверены!!!
function crud (colName) {
  return {
    find: (expression, limit, skip, cb) => {
      db[colName].find(expression).limit(limit).skip(skip).exec((err, docs) => {
        return cb(err, docs);
      });
    },
    findById: (id, cb) => {
      db[colName].find({ _id: id }).exec((err, docs) => {
        return cb(err, docs[0]);
      });
    },
    insert: (docs, cb) => {
      db[colName].create(docs, (err, results) => {
        return cb(err, results);
      });
    },
    remove: (expression, cb) => {
      db[colName].remove(expression, { multi: true }, (err) => {
        return cb(err);
      });
    },
    removeById: (id, cb) => {
      db[colName].find({ _id: id }).exec((err, docs) => {
        if (err) {
          return cb(err);
        }
        if (!docs[0]) {
          return cb(null, 0);
        }
        db[colName].remove({ _id: id }, (err) => {
          return cb(err, 1);
        });
      });
    },
    update: (expression, data, cb) => {
      db[colName].update(expression, { $set: data }, { multi: true }, (err, numReplaced) => {
        return cb(err, numReplaced);
      });
    },
    updateById: (id, data, cb) => {
        db[colName].update({ _id: id }, { $set: data }, {}, (err, numReplaced) => {
          if (err) {
            return cb(err);
          }
          db[colName].find({ _id: id }).exec((err, docs) => {
          return cb(err, docs[0]);
        });
      });

    },
    count: (expression, cb) => {
      db[colName].where(expression).count((err, count) => {
        console.log('delete me! count ' + count);
        return cb(err, count);
      });
    }
  };
}

const resultDb = { mgDb: db };

Object.keys(dbCollections).forEach((key) => {
  resultDb[dbCollections[key].name] = crud(dbCollections[key].name);
});

export default resultDb;

import async from 'async';
import dbCollections from './/db-collections';

const seedData = {
  'camera-types': [
    {
      "rtspUrlTail": "channel=1&stream=0",
      "name": "хз, офисная"
    },
  ],
};

export default (db) => {

  // todo вынести в dbCollections
  function getCollection (colName) {
    if (dbCollections[colName]) {
      return db[dbCollections[colName].name];
    } else {
      return null;
    }
  }

  let executed = false;

  async.eachLimit(Object.keys(seedData), 1,
    (colName, done) => {
      const colData = seedData[colName];
      const collection = getCollection(colName);
      async.waterfall([
        (callback) => {
          if (!collection) {
            return callback(new Error('collection' + colName + ' not found'));
          }
          return callback();
        },
        (callback) => {
          const limit = 1;
          const skip = 0;
          collection.find({}, limit, skip, (err, someDocs) => {
            if (someDocs.length > 0) {
              return callback(true);
            }
            return callback();
          });
        },
        (callback) => {
          collection.insert(colData, (err) => {
            return callback(err);
          });
        }
      ], (err) => {
        if (err === true) {
          console.log(colName + ' is not empty.');
          return done();
        }
        if (err) {
          return done(err);
        }
        console.log('>> seeding ' + colName);
        return done();
      });
    },
    (err) => {
      if (err) {
        console.log('dbseed err: ' + err.message);
        throw err;
      } else {
        if (executed) {
          console.log('dbseed executed.');
        }
      }
    }
  );
}

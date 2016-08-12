import chokidar from 'chokidar';
import options from './../../../options';
import dg from 'debug';
const debug = dg('swdog');
import fs from 'fs';
import db from './../db';
import manifestParser from './../utils/manifest-parser';

class SegmentsWatchDog {
  constructor () {
    this.sourceDir = options.sourceDirPath;
    this.watchers = {};
  }

  initialize () {
    this.dbSegmentsClear(() => {
      this.watchSource();
    });
  }

  dbSegmentsClear (cb) {
    db.Segments.remove({}, (err) => {
      if (err) {
        debug('db.Segments clear err:', err.message);
      }
      debug('db.Segments cleared');
      return cb();
    });
  }

  watchSource () {
    debug('watchSource()');
    this.Watcher = chokidar.watch(this.sourceDir);
    this.Watcher
      .on('addDir', pth => {
        if (this.sourceDir !== pth) {
          const folderName = this.getPathLastItem(pth);
          debug('addDir => ', folderName);
          this.addWatcher(folderName, pth);
        }
      })
      .on('unlinkDir', pth => {
        const folderName = this.getPathLastItem(pth);
        debug('unlinkDir => ', folderName);
        this.removeWatcher(folderName);
      })
      .on('error', pth => {
        debug('error => ', pth);
      })
      .on('ready', () => {
        debug('Main watcher. Ready for changes =>', this.sourceDir);
      });
  }

  prepSegmentDoc (prms, cb) {
    const { parentFolderName, fileName, pth, segmentNumber } = prms;
    fs.stat(pth, (err, stats) => {
      if (err) {
        return cb(err);
      }
      return cb(null, {
        cameraId: parentFolderName,
        number: segmentNumber,
        size: stats.size,
        fileName: fileName,
        atime: stats.atime, // Access Time
        mtime: stats.mtime, // Modified Time
        ctime: stats.ctime, // Change Time
        birthtime: stats.birthtime
      });
    });
  }

  checkSegmentFileName (fileName) {
    // TODO добавить проверку на .tmp, если нет => true
    let isItSegment = false;
    if (fileName.match(/chunk/g)) {
      isItSegment = true;
    }
    if (fileName.match(/.tmp/g)) {
      isItSegment = false;
    }
    return isItSegment;
  }

  parseSegmentNameNumber (fileName) {
    let segmentNumber = fileName.match(/\d{2,}/g)[0];
    if (segmentNumber) {
      segmentNumber = parseInt(segmentNumber);
    }
    return segmentNumber;
  }

  updateSessionMpdInfo (fileName, pth, cameraId) {
    if (fileName === 'manifest.mpd') {// TODO переделать сравнение, наименование Mpd может меняться.
      manifestParser(pth, (err, mpdInfo) => {
        if (err) {
          debug('manifestParser err', err.message);
        }
        // db.Sessions.insert({ mpdInfo, cameraId, createdAt: new Date() }, (err) => {
        //   if (err) {
        //     debug('db.Sessions.insert err', err.message);
        //   }
        // });
        // TODO пока перезаписываем предыдущую сессию.
        db.Sessions.find({ cameraId }, 0, 0, (err, docs) => {
          if (err) {
            debug('db.Segments.insert err', err.message);
          } else {
            if (docs[0]) {
              db.Sessions.updateById(docs[0]._id, { mpdInfo, createdAt: new Date() }, (err) => {
                if (err) {
                  debug('db.Sessions.updateById err', err.message);
                }
              });
            } else {
              db.Sessions.insert({ mpdInfo, cameraId, createdAt: new Date() }, (err) => {
                if (err) {
                  debug('db.Sessions.insert err', err.message);
                }
              });
            }
          }
        });
      });
    }
  }

  addWatcher (cameraId, dir) {
    if (!this.watchers.hasOwnProperty(cameraId)) {
      this.watchers[cameraId] = chokidar.watch(dir + '/manifest.mpd');
      this.watchers[cameraId]
        .on('change', pth => {
          const fileName = this.getPathLastItem(pth);
          debug(cameraId, 'changed => ', fileName);
          this.updateSessionMpdInfo(fileName, pth, cameraId);
        })
        .on('add', pth => {
          const fileName = this.getPathLastItem(pth);
          debug(cameraId, 'add => ', fileName);
          if (this.checkSegmentFileName(fileName)) {
            const segmentNumber = this.parseSegmentNameNumber(fileName);
            this.prepSegmentDoc({ cameraId, fileName, pth, segmentNumber }, (err, doc) => {
              if (err) {
                debug('prepSegmentDoc err', err.message);
              } else {
                db.Segments.insert(doc, (err) => {
                  if (err) {
                    debug('db.Segments.insert err', err.message);
                  }
                });
              }
            });
          } else {
            this.updateSessionMpdInfo(fileName, pth, cameraId);
          }
        })
        .on('unlink', pth => {
          const fileName = this.getPathLastItem(pth);
          debug(cameraId, 'unlink => ', fileName);
          db.Segments.remove({ cameraId, fileName }, (err) => {
            if (err) {
              debug('db.Segments.insert err', err.message);
            }
          });
        })
        .on('error', pth => {
          const fileName = this.getPathLastItem(pth);
          debug(cameraId, 'error => ', fileName);
        })
        .on('ready', () => {
          debug('watcher', cameraId, ' ready for changes');
        });
    }
  }

  removeWatcher (folderName) {
    if (this.watchers.hasOwnProperty(folderName)) {
      delete this.watchers[folderName];
    }
  }

  getPathLastItem (dir) {
    let splitResult = dir.split('\\');
    if (splitResult.length > 1) {
      return splitResult[splitResult.length - 1];
    } else {
      splitResult = dir.split('/');
      if (splitResult.length > 1) {
        return splitResult[splitResult.length - 1];
      } else {
        // TODO err
        return 'unknown';
      }
    }
  }
}

const swdog = new SegmentsWatchDog();
export default swdog;

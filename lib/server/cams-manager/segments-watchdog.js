import chokidar from 'chokidar';
import options from './../../../options';
import dg from 'debug';
const debug = dg('swdog');
import fs from 'fs';
import db from './../db';

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
    // возможно лучше переделать на простую проверку добавления и удаления папок. 1000ms
    // будет ли тормозить при большом количестве папок?
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
    const {parentFolderName, fileName, pth} = prms;
    fs.stat(pth, (err, stats) => {
      if (err) {
        return cb(err);
      }
      return cb(null, {
        cameraId: parentFolderName,
        size: stats.size,
        fileName: fileName,
        atime: stats.atime, // Access Time
        mtime: stats.mtime, // Modified Time
        ctime: stats.ctime, // Change Time
        birthtime: stats.birthtime
      });
    });
  }

  addWatcher (cameraId, dir) {
    if (!this.watchers.hasOwnProperty(cameraId)) {
      this.watchers[cameraId] = chokidar.watch(dir);
      this.watchers[cameraId]
        .on('change', pth => {
          const fileName = this.getPathLastItem(pth);
          debug(cameraId, 'changed => ', fileName);
        })
        .on('add', pth => {
          const fileName = this.getPathLastItem(pth);
          debug(cameraId, 'add => ', fileName);
          this.prepSegmentDoc({cameraId, fileName, pth}, (err, doc) => {
            if (err) {
              debug('prepSegmentDoc err'. err.message);
            } else {
              db.Segments.insert(doc, (err) => {
                if (err) {
                  debug('db.Segments.insert err'. err.message);
                }
              });
            }
          });
        })
        .on('unlink', pth => {
          const fileName = this.getPathLastItem(pth);
          debug(cameraId, 'unlink => ', fileName);
          db.Segments.remove({cameraId, fileName}, (err) => {
            if (err) {
              debug('db.Segments.insert err'. err.message);
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
    if (splitResult.length > 0) {
      return splitResult[splitResult.length - 1];
    } else {
      splitResult = dir.split('/');
      if (splitResult.length > 0) {
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

import chokidar from 'chokidar';
import options from './../../../options';
import dg from 'debug';
const debug = dg('swdog');

class SegmentsWatchDog {
  constructor () {
    this.sourceDir = options.sourceDirPath;
    this.initialize();
  }

  initialize () {

  }

  watch () {
    this.Watcher = chokidar.watch(this.sourceDir);
    this.Watcher
      .on('change', pth => {
        debug('changed => ', pth);
      })
      .on('add', pth => {
        debug('add => ', pth);
      })
      .on('unlink', pth => {
        debug('unlink => ', pth);
      })
      .on('addDir', pth => {
        debug('addDir => ', pth);
      })
      .on('unlinkDir', pth => {
        debug('changed => ', pth);
      })
      .on('error', pth => {
        debug('error => ', pth);
      })
      .on('raw', (event, pth, details) => {
        debug('Raw event info:', event, pth, details);
      })
      .on('ready', () => {
        debug('ready => ', 'Initial scan complete. Ready for changes');
      });
  }
}

const swdog = new SegmentsWatchDog();
export default swdog;

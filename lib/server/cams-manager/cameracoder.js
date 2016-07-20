import dg from 'debug';
import Spawn from 'node-spawn';
const debug = dg('cameracoder');
import path from 'path';
import fs from 'fs';
import options from '../../../options';

export default class Cameracoder {
  constructor (props, args = []) {
    const { rtspUrl, cameraId, mpd } = props;
    this.info = {
      startedAt: null,
      stoppedAt: null,
      rtspUrl: rtspUrl,
      cameraId: cameraId,
      isWorking: false
    };
    this.command = 'ffmpeg';
    this.sourceDirPath = this.prepSourceDirPath();
    this.mpdPath = path.resolve(this.sourceDirPath, 'manifest.mpd');
    debug('mpdPath', this.mpdPath);
    this.prepArgs(args);
  }

  prepArgs (args) {
    this.args = ['-i', this.info.rtspUrl].concat(args, ['-f', 'dash', this.mpdPath]);
  }

  prepSourceDirPath () {
    const folderPath = options.sourceDirPath + '/' + this.info.cameraId;
    if (fs.existsSync(folderPath)) {
      return folderPath;
    } else {
      fs.mkdirSync(folderPath);
      return folderPath;
    }
  }

  start () {
    debug('start');
    this.spawn = Spawn({
      cmd: this.command,
      args: this.args,
      cwd: this.sourceDirPath,
      restarts: 0,
      onStdout: (data) => {
        // debug('stdout on data', data);
      },
      onStderr: (data) => {
        // debug('stderr on data', data);
      }
    });
    this.spawn.start();
    this.info.isWorking = true;
    this.info.startedAt = new Date();
  }

  stop () {
    debug('stop');
    this.spawn.kill();
    delete this.spawn;
    this.info.isWorking = false;
    this.info.stoppedAt = new Date();
  }

  restart () {
    debug('restart');
    this.stop();
    this.start();
  }
}

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
    this.args = args;
    this.command = 'ffmpeg';
    this.sourceDirPath = this.prepSourceDirPath();
    this.mpdPath = path.resolve(this.sourceDirPath, 'manifest.mpd');
    debug('mpdPath', this.mpdPath);
  }

  prepArgs () {
    return ['-i', this.info.rtspUrl].concat(this.args, ['-f', 'segment', '-vcodec', 'copy', '-reset_timestamps', '1', '-map', '0', '-f', 'dash', this.mpdPath]);
  }

  rmdir (dir, isSecond) {
    const list = fs.readdirSync(dir);
    for (let i = 0; i < list.length; i++) {
      const filename = path.join(dir, list[i]);
      const stat = fs.statSync(filename);
      if (filename == "." || filename == "..") {
      } else if (stat.isDirectory()) {
        this.rmdir(filename, true);
      } else {
        fs.unlinkSync(filename);
      }
    }
    if (isSecond) {
      fs.rmdirSync(dir);
      debug('rmdir path:', dir);
    }
  }

  prepSourceDirPath () {
    const folderPath = options.sourceDirPath + this.info.cameraId;
    if (fs.existsSync(folderPath)) {
      return folderPath;
    } else {
      debug('start => mkdir path:', folderPath);
      fs.mkdir(folderPath, (err) => {
        if (err) {
          debug('mkdir err:', err.message);
        }
      });
      return folderPath;
    }
  }

  start () {
    debug('start');
    const folderPath = path.resolve(options.sourceDirPath, this.info.cameraId);
    this.rmdir(folderPath);
    const args = this.prepArgs();
    this.spawn = Spawn({
      cmd: this.command,
      args: args,
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

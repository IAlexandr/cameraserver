import dg from 'debug';
import Spawn from 'node-spawn';
const debug = dg('cameracoder');
import path from 'path';
import {sourceDirPath} from '../../options';

export default class Cameracoder {
  constructor (props, args = []) {
    const { rtspUrl, cameraId, mpd } = props;
    this.rtspUrl = rtspUrl;
    this.cameraId = cameraId;
    this.command = 'ffmpeg';
    this.mpd = path.resolve(sourceDirPath, this.cameraId + '/manifest.mpd');
    this.prepArgs(args);
    this.checkStore();
  }

  prepArgs (args) {
    this.args = ['-i', this.rtspUrl].concat(args, ['-f', 'dash', this.mpd]);
  }

  checkStore () {
    // TODO подготовить папку для сегментов
  }

  start () {
    debug('start');
    debug('this.args', this.args);
    this.spawn = Spawn({
      cmd: this.command,
      args: this.args,
      cwd: path.resolve(__dirname, ),
      restarts: 0,
      onStdout: (data) => {
        debug('stdout on data', data);
      },
      onStderr: (data) => {
        debug('stderr on data', data);
      }
    });
    this.spawn.start();
  }

  stop () {
    debug('stop');
    this.spawn.kill();
    delete this.spawn;
  }

  restart () {
    debug('restart');
    this.stop();
    this.start();
  }
}

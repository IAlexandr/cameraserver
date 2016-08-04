import Cameracoder from './cameracoder';
import db from './../db';
import dg from 'debug';
import options from '../../../options';
const debug = dg('cameracoders-manager');
import fs from 'fs';
import path from 'path';
import swdog from './segments-watchdog';

function prepRtspUrl (camera, type) {
  if (camera && type) {
    let query = camera.query || '';
    const queryTail = type.rtspUrlTail || '';
    if (query) {
      if (queryTail) {
        query = query + '&' + queryTail;
      }
    } else {
      if (queryTail) {
        query = queryTail;
      }
    }
    let userpass = '';
    if (camera.username && camera.password) {
      userpass = camera.username + ':' + camera.password + '@';
    }
    return 'rtsp://' + userpass + camera.ip + '/' + query;
  } else {
    return null;
  }
}

class CameracodersManager {
  constructor () {
    this.cameraCoders = {};
    this.initialize();
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
      debug('rmdir path:', dir);
      fs.rmdirSync(dir);
    }
  }

  initialize () {
    debug('initialize');
    debug('start swdog!');
    swdog.watch();
    // временное решение удалить все папки
    this.rmdir(options.sourceDirPath);
    db.CameraTypes.find({}, 0, 0, (err, types) => {
      if (err) {
        throw err;
      }
      db.Cameras.find({}, 0, 0, (err, cameras) => {
        if (err) {
          throw err;
        }
        cameras.forEach((camera) => {
          let type = types.filter((type) => {
            return type._id === camera.cameraTypeId;
          });
          type = type[0];
          this.add({ camera, type });
        });
      });
    });
  }

  add (props, callback = (err) => {
  }) {
    const { camera, type } = props;
    if (this.cameraCoders.hasOwnProperty(camera._id)) {
      return callback(new Error('по этой камере уже создан cameracoder.'));
    }
    const rtspUrl = prepRtspUrl(camera, type);
    if (rtspUrl) {
      this.cameraCoders[camera._id] = new Cameracoder({
        rtspUrl,
        cameraId: camera._id
      });
      debug('added', this.cameraCoders[camera._id].info);
      return callback();
    } else {
      debug(camera._id, camera.ip, 'rtspUrl не сформирован.');
      return callback(new Error('rtspUrl не сформирован.'));
    }
  }

  update (props, callback = (err) => {
  }) {
    const { camera, type } = props;
    let ccoder;

    function prepCc () {
      const cc = this.cameraCoders[camera._id];
      if (!cc) {
        return callback(new Error('Cameracoder не инициализирован (не найден).'));
      }
      cc.rtspUrl = prepRtspUrl(camera, type);
      return cc;
    }

    if (!this.cameraCoders.hasOwnProperty(camera._id)) {
      this.add(props, (err) => {
        if (err) {
          return callback(err);
        }
        ccoder = this.cameraCoders[camera._id];
        return callback(null, ccoder);
      });
    } else {
      return callback(null, prepCc());
    }
  }

  updateAndRestart (props, callback = (err) => {
  }) {
    this.update(props, (err, cc) => {
      if (err) {
        return callback(err);
      }
      cc.restart();
    });
  }

  remove (ccOrId, callback = (err) => {
  }) {
    let cc = ccOrId;
    if (typeof ccOrId === 'string') {
      cc = this.cameraCoders[ccOrId];
    }
    if (!cc) {
      return callback(new Error(ccOrId + ' cameraCoder не найден.'));
    } else {
      debug('remove', cc.info.cameraId);
      if (cc.isWorking) {
        cc.stop();
      }
      delete this.cameraCoders[cc.info.cameraId];
      return callback();
    }
  }

  start (ccOrId, callback = () => {
  }) {
    debug('start');
    let cc = ccOrId;
    if (typeof ccOrId === 'string') {
      cc = this.cameraCoders[ccOrId];
    }
    if (!cc) {
      return callback(new Error(ccOrId + ' cameraCoder не найден.'));
    } else {
      debug('start', cc.info.cameraId);
      if (cc.isWorking) {
        return callback(new Error(cc.info.cameraId + ' cameraCoder уже работает.'));
      } else {
        cc.start();
        return callback(null, cc.info);
      }
    }
  }

  startAll () {
    debug('startAll');
    Object.keys(this.cameraCoders).forEach((cc) => {
      if (!cc.info.isWorking) {
        this.start(cc);
      }
    });
  }

  stopAll () {
    debug('stopAll');
    Object.keys(this.cameraCoders).forEach((cc) => {
      if (!cc.info.isWorking) {
        this.start(cc);
      }
    });
  }

  restartAll () {
    debug('restartAll');
    Object.keys(this.cameraCoders).forEach((cc) => {
      this.restart(cc);
    });
  }

  stop (ccOrId, callback = () => {
  }) {
    let cc = ccOrId;
    if (typeof ccOrId === 'string') {
      cc = this.cameraCoders[ccOrId];
    }
    debug(cc.info);
    if (!cc) {
      return callback(new Error(ccOrId + ' cameraCoder не найден.'));
    } else {
      debug('stop', cc.info.cameraId);
      if (!cc.info.isWorking) {
        return callback(new Error(cc.info.cameraId + ' cameraCoder уже остановлен.'));
      } else {
        debug('cc.stop()');
        cc.stop();
        return callback(null, cc.info);
      }
    }
  }

  stopAll () {
    debug('stopAll');
    Object.keys(this.cameraCoders).forEach((cc) => {
      if (cc.info.isWorking) {
        this.stop(cc);
      }
    });
  }

  restart (ccOrId, callback = () => {
  }) {
    debug('restart');
    let cc = ccOrId;
    if (typeof ccOrId === 'string') {
      cc = this.cameraCoders[ccOrId];
    }
    if (!cc) {
      return callback(new Error(ccOrId + ' cameraCoder не найден.'));
    } else {
      cc.restart();
      return callback(null, cc.info);
    }
  }

  getWorkingCCoders (callback) {
    debug('getWorkingCCoders');
    return callback(null, Object.keys(this.cameraCoders).filter((ccId) => {
      if (this.cameraCoders[ccId].info.isWorking) {
        return this.cameraCoders[ccId].info;
      }
    }));
  }

  getCCoders (callback) {
    debug('getCCoders');
    return callback(null, Object.keys(this.cameraCoders).map((ccId) => {
      return this.cameraCoders[ccId].info;
    }));
  }
}

const CM = new CameracodersManager();

export default CM;

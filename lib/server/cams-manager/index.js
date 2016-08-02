import Cameracoder from './cameracoder';
import db from './../db';
import dg from 'debug';
const debug = dg('cameracoders-manager');

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
    return 'rtsp://' + camera.ip + '/' + query;
  } else {
    return null;
  }
}

 class CameracodersManager {
  constructor () {
    this.cameraCoders = {};
    this.initialize();
  }

  initialize () {
    debug('initialize');
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
          this.add({camera, type});
        });
      });
    });
  }

  add (props, callback = (err) => {}) {
    const {camera, type} = props;
    const rtspUrl = prepRtspUrl(camera, type);
    if (rtspUrl) {
      this.cameraCoders[camera._id] = new Cameracoder({
        rtspUrl,
        cameraId: camera._id
      });
      debug(this.cameraCoders[camera._id].info);
      return callback();
    } else {
      debug(camera._id, camera.ip, 'rtspUrl не сформирован.');
      return callback(new Error('rtspUrl не сформирован.'));
    }
  }

  updateAndRestart (props, callback = (err) => {}) {
    const {camera, type} = props;
    const cc = this.cameraCoders[camera._id];
    if (!cc) {
      return callback(new Error('Cameracoder не инициализирован (не найден).'));
    }
    cc.rtspUrl = prepRtspUrl(camera, type);
    cc.restart();
  }

  // TODO remove

  start (ccOrId, callback = () => {}) {
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

  stop (ccOrId, callback = () => {}) {
    debug('stop');
    let cc = ccOrId;
    if (typeof ccOrId === 'string') {
      cc = this.cameraCoders[ccOrId];
    }
    if (!cc) {
      return callback(new Error(ccOrId + ' cameraCoder не найден.'));
    } else {
      debug('stop', cc.info.cameraId);
      if (!cc.isWorking) {
        return callback(new Error(cc.info.cameraId, ' cameraCoder уже остановлен.'));
      } else {
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

  restart (ccOrId, callback = () => {}) {
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

  getWorkingCCCameras (callback) {
    debug('getWorkingCCCameras');
    return callback(null, Object.keys(this.cameraCoders).map((ccId) => {
      if (this.cameraCoders[ccId].info.isWorking) {
        return this.cameraCoders[ccId].info;
      }
    }));
  }

  getCCCameras (callback) {
    debug('getCCCameras');
    return callback(null, Object.keys(this.cameraCoders).map((ccId) => {
      return this.cameraCoders[ccId].info;
    }));
  }
};

const CM = new CameracodersManager();

export default CM;

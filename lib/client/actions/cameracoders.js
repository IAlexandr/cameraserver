import superagent from 'superagent';
import {actions as smessagesActions} from './smessages';

export const actionTypes = {
  LOAD_CAMERACODERS_COMPLETE: 'LOAD_CAMERACODERS_COMPLETE',
  LOAD_CAMERACODERS_FAILED: 'LOAD_CAMERACODERS_FAILED',
  LOAD_CAMERACODERS: 'LOAD_CAMERACODERS',

  START_CAMERACODER_COMPLETE: 'START_CAMERACODER_COMPLETE',
  START_CAMERACODER_FAILED: 'START_CAMERACODER_FAILED',
  START_CAMERACODER: 'START_CAMERACODER',

  STOP_CAMERACODER_COMPLETE: 'STOP_CAMERACODER_COMPLETE',
  STOP_CAMERACODER_FAILED: 'STOP_CAMERACODER_FAILED',
  STOP_CAMERACODER: 'STOP_CAMERACODER'
};

export function loadCameraCodersComplete (cameraCoders) {
  return {
    type: actionTypes.LOAD_CAMERACODERS_COMPLETE,
    cameraCoders
  };
}

export function loadCameraCodersFailed (err) {
  return {
    type: actionTypes.LOAD_CAMERACODERS_FAILED,
    err
  };
}

export function loadCameraCoders (callback) {
  return dispatch => {
    dispatch({
      type: actionTypes.LOAD_CAMERACODERS
    });

    superagent.get('/api/cameracoders')
      .accept('application/json')
      .end((err, res) => {
        if (callback) {
          callback(err, !err ? JSON.parse(res.body) : null);
        }
        if (err) {
          dispatch(loadCameraCodersFailed(err));
        } else {
          setTimeout(() => dispatch(loadCameraCodersComplete(res.body)), 1000);
        }
      });
  };
}


export function startCameraCoderComplete (camera) {
  return {
    type: actionTypes.START_CAMERACODER_COMPLETE,
    camera
  };
}

export function startCameraCoderFailed (err) {
  return {
    type: actionTypes.START_CAMERACODER_FAILED,
    err
  };
}

export function startCameraCoder (cameraId) {
  return dispatch => {
    dispatch({
      type: actionTypes.START_CAMERACODER
    });

    superagent.post('/api/cameracoders/' + cameraId + '/start')
      .accept('application/json')
      .end((err, res) => {
        if (err) {
          dispatch(smessagesActions.openMessage('Ошибка: ' + err.message + '. Запись с камеры не запущена.'));
          dispatch(startCameraCoderFailed(err));
        } else {
          dispatch(smessagesActions.openMessage('Запись с камеры запущена.'));
          dispatch(startCameraCoderComplete(res.body));
          dispatch(loadCameraCoders());
        }
      });
  };
}

export function stopCameraCoderComplete (camera) {
  return {
    type: actionTypes.STOP_CAMERACODER_COMPLETE,
    camera
  };
}

export function stopCameraCoderFailed (err) {
  return {
    type: actionTypes.STOP_CAMERACODER_FAILED,
    err
  };
}

export function stopCameraCoder (cameraId) {
  return dispatch => {
    dispatch({
      type: actionTypes.STOP_CAMERACODER
    });

    superagent.post('/api/cameracoders/' + cameraId + '/stop')
      .accept('application/json')
      .end((err, res) => {
        if (err) {
          dispatch(smessagesActions.openMessage('Ошибка: ' + err.message + '. Запись с камеры не остановлена.'));
          dispatch(stopCameraCoderFailed(err));
        } else {
          dispatch(smessagesActions.openMessage('Запись с камеры остановлена.'));
          dispatch(stopCameraCoderComplete(res.body));
          dispatch(loadCameraCoders());
        }
      });
  };
}

export const actions = {
  loadCameraCodersComplete,
  loadCameraCodersFailed,
  loadCameraCoders,

  startCameraCoderComplete,
  startCameraCoderFailed,
  startCameraCoder,

  stopCameraCoderComplete,
  stopCameraCoderFailed,
  stopCameraCoder,
};

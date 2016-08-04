import superagent from 'superagent';
import {actions as smessagesActions} from './smessages';
import {actions as cameraCodersActions} from './cameracoders';

export const actionTypes = {
  LOAD_CAMERAS_COMPLETE: 'LOAD_CAMERAS_COMPLETE',
  LOAD_CAMERAS_FAILED: 'LOAD_CAMERAS_FAILED',
  LOAD_CAMERAS: 'LOAD_CAMERAS',

  UPSERT_CAMERA_COMPLETE: 'UPSERT_CAMERA_COMPLETE',
  UPSERT_CAMERA_FAILED: 'UPSERT_CAMERA_FAILED',
  UPSERT_CAMERA: 'UPSERT_CAMERA',

  DELETE_CAMERA: 'DELETE_CAMERA',
};

export function loadCamerasComplete (cameras) {
  return {
    type: actionTypes.LOAD_CAMERAS_COMPLETE,
    cameras
  };
}

export function loadCamerasFailed (err) {
  return {
    type: actionTypes.LOAD_CAMERAS_FAILED,
    err
  };
}

export function loadCameras (callback) {
  return dispatch => {
    dispatch({
      type: actionTypes.LOAD_CAMERAS
    });

    superagent.get('http://localhost:4000/api/cameras')
      .accept('application/json')
      .end((err, res) => {
        if (callback) {
          callback(err, !err ? JSON.parse(res.body) : null);
        }
        if (err) {
          dispatch(loadCamerasFailed(err));
        } else {
          setTimeout(() => dispatch(loadCamerasComplete(res.body)), 1000);
        }
      });
  };
}

export function upsertCameraComplete (camera) {
  return {
    type: actionTypes.UPSERT_CAMERA_COMPLETE,
    camera
  };
}

export function upsertCameraFailed (err) {
  return {
    type: actionTypes.UPSERT_CAMERA_FAILED,
    err
  };
}

export function upsertCamera (data) {
  return dispatch => {
    dispatch({
      type: actionTypes.UPSERT_CAMERA
    });

    superagent.post('http://localhost:4000/api/cameras')
      .send(data)
      .accept('application/json')
      .end((err, res) => {
        if (err) {
          dispatch(smessagesActions.openMessage('Ошибка: ' + err.message + '. Камера не сохранена.'));
          dispatch(upsertCameraFailed(err));
        } else {
          dispatch(smessagesActions.openMessage('камера сохранена.'));
          dispatch(upsertCameraComplete(res.body));
          dispatch(loadCameras());
          dispatch(cameraCodersActions.loadCameraCoders());
        }
      });
  };
}

export function deleteCamera (cameraId) {
  return dispatch => {

    superagent.delete('http://localhost:4000/api/cameras')
      .send({cameraId})
      .accept('application/json')
      .end((err, res) => {
        if (err) {
          dispatch(smessagesActions.openMessage('Ошибка: ' + err.message + '. Камера не удалена.'));
        } else {
          dispatch(smessagesActions.openMessage('камера удалена.'));
          dispatch(loadCameras());
        }
      });
  };
}

export const actions = {
  loadCamerasComplete,
  loadCamerasFailed,
  loadCameras,

  upsertCameraComplete,
  upsertCameraFailed,
  upsertCamera,

  deleteCamera,
};
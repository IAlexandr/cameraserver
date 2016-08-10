import superagent from 'superagent';
import {actions as smessagesActions} from './smessages';

export const actionTypes = {
  LOAD_CAMERA_TYPES_COMPLETE: 'LOAD_CAMERA_TYPES_COMPLETE',
  LOAD_CAMERA_TYPES_FAILED: 'LOAD_CAMERA_TYPES_FAILED',
  LOAD_CAMERA_TYPES: 'LOAD_CAMERA_TYPES',

  UPSERT_CAMERA_TYPE_COMPLETE: 'UPSERT_CAMERA_TYPE_COMPLETE',
  UPSERT_CAMERA_TYPE_FAILED: 'UPSERT_CAMERA_TYPE_FAILED',
  UPSERT_CAMERA_TYPE: 'UPSERT_CAMERA_TYPE',
};

export function loadCameraTypesComplete (cameraTypes) {
  return {
    type: actionTypes.LOAD_CAMERA_TYPES_COMPLETE,
    cameraTypes
  };
}

export function loadCameraTypesFailed (err) {
  return {
    type: actionTypes.LOAD_CAMERA_TYPES_FAILED,
    err
  };
}

export function loadCameraTypes (callback) {
  return dispatch => {
    dispatch({
      type: actionTypes.LOAD_CAMERA_TYPES
    });

    superagent.get('/api/camera-types')
      .accept('application/json')
      .end((err, res) => {
        if (callback) {
          callback(err, !err ? JSON.parse(res.body) : null);
        }
        if (err) {
          dispatch(loadCameraTypesFailed(err));
        } else {
          setTimeout(() => dispatch(loadCameraTypesComplete(res.body)), 1000);
        }
      });
  };
}


export function upsertCameraTypeComplete (cameraType) {
  return {
    type: actionTypes.UPSERT_CAMERA_TYPE_COMPLETE,
    cameraType
  };
}

export function upsertCameraTypeFailed (err) {
  return {
    type: actionTypes.UPSERT_CAMERA_TYPE_FAILED,
    err
  };
}

export function upsertCameraType (data) {
  return dispatch => {
    dispatch({
      type: actionTypes.UPSERT_CAMERA_TYPE
    });

    superagent.post('/api/camera-types')
      .send(data)
      .accept('application/json')
      .end((err, res) => {
        if (err) {
          dispatch(smessagesActions.openMessage('Ошибка: ' + err.message + '. Тип камеры не сохранен.'));
          dispatch(upsertCameraTypeFailed(err));
        } else {
          dispatch(smessagesActions.openMessage('Тип камеры сохранен.'));
          dispatch(upsertCameraTypeComplete(res.body));
          dispatch(loadCameraTypes());
        }
      });
  };
}

export function deleteCameraType (cameraTypeId) {
  return dispatch => {

    superagent.delete('/api/camera-types')
      .send({cameraTypeId})
      .accept('application/json')
      .end((err, res) => {
        if (err) {
          dispatch(smessagesActions.openMessage('Ошибка: ' + err.message + '. Тип камеры не удален.'));
        } else {
          dispatch(smessagesActions.openMessage('Тип камеры удален.'));
          dispatch(loadCameraTypes());
        }
      });
  };
}

export const actions = {
  loadCameraTypesComplete,
  loadCameraTypesFailed,
  loadCameraTypes,

  upsertCameraTypeComplete,
  upsertCameraTypeFailed,
  upsertCameraType,

  deleteCameraType
};

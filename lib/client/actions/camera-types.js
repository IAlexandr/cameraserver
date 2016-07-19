import superagent from 'superagent';

export const actionTypes = {
  LOAD_CAMERA_TYPES_COMPLETE: 'LOAD_CAMERA_TYPES_COMPLETE',
  LOAD_CAMERA_TYPES_FAILED: 'LOAD_CAMERA_TYPES_FAILED',
  LOAD_CAMERA_TYPES: 'LOAD_CAMERA_TYPES',
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

    superagent.get('http://localhost:4000/api/camera-types')
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

export const actions = {
  loadCameraTypesComplete,
  loadCameraTypesFailed,
  loadCameraTypes
};
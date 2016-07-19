import superagent from 'superagent';

export const actionTypes = {
  LOAD_CAMERAS_COMPLETE: 'LOAD_CAMERAS_COMPLETE',
  LOAD_CAMERAS_FAILED: 'LOAD_CAMERAS_FAILED',
  LOAD_CAMERAS: 'LOAD_CAMERAS',
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

export const actions = {
  loadCamerasComplete,
  loadCamerasFailed,
  loadCameras
};
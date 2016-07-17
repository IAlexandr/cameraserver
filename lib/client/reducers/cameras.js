import {
  camerasActionTypes
} from '../actions';

const {
  LOAD_CAMERAS,
  LOAD_CAMERAS_FAILED,
  LOAD_CAMERAS_COMPLETE,
} = camerasActionTypes;

const initialState = {
  error: '',
  loading: false,
  data: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_CAMERAS:
      return {
        loading: true,
        error: '',
        data: {}
      };

    case LOAD_CAMERAS_FAILED:
      return {
        loading: false,
        error: action.err,
        data: {}
      };

    case LOAD_CAMERAS_COMPLETE:
      return {
        loading: false,
        error: '',
        data: action.cameras
      };

    default:
      return state;
  }
}

import {
  cameraTypesActionTypes
} from '../actions';

const {
  LOAD_CAMERA_TYPES,
  LOAD_CAMERA_TYPES_FAILED,
  LOAD_CAMERA_TYPES_COMPLETE,
} = cameraTypesActionTypes;

const initialState = {
  error: '',
  loading: false,
  data: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_CAMERA_TYPES:
      return {
        loading: true,
        error: '',
        data: {}
      };

    case LOAD_CAMERA_TYPES_FAILED:
      return {
        loading: false,
        error: action.err,
        data: {}
      };

    case LOAD_CAMERA_TYPES_COMPLETE:
      const cameraTypes = {};
      action.cameraTypes.forEach((cameraType) => {
        cameraTypes[cameraType._id] = cameraType;
      });
      return {
        loading: false,
        error: '',
        data: cameraTypes
      };

    default:
      return state;
  }
}

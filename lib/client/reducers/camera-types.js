import {
  cameraTypesActionTypes
} from '../actions';

const {
  LOAD_CAMERA_TYPES,
  LOAD_CAMERA_TYPES_FAILED,
  LOAD_CAMERA_TYPES_COMPLETE,

  UPSERT_CAMERA_TYPE_COMPLETE,
  UPSERT_CAMERA_TYPE_FAILED,
  UPSERT_CAMERA_TYPE,
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

    case UPSERT_CAMERA_TYPE:
      return {
        ...state,
        ...{
          sending: true,
          error: ''
        }
      };

    case UPSERT_CAMERA_TYPE_FAILED:
      return {
        ...state,
        ...{
          sending: false,
          error: action.err
        }
      };

    case UPSERT_CAMERA_TYPE_COMPLETE:
      const data = Object.assign({}, state.data);
      data[action.cameraType._id] = action.cameraType;
      return {
        ...state,
        ...{
          sending: false,
          error: '',
          data: data
        }
      };

    default:
      return state;
  }
}

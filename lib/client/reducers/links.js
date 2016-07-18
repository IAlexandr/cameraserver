import {
  linksActionTypes
} from '../actions';

const {
  LOAD_LINKS,
  LOAD_LINKS_FAILED,
  LOAD_LINKS_COMPLETE,
} = linksActionTypes;

const initialState = {
  error: '',
  loading: false,
  data: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_LINKS:
      return {
        loading: true,
        error: '',
        data: {}
      };

    case LOAD_LINKS_FAILED:
      return {
        loading: false,
        error: action.err,
        data: {}
      };

    case LOAD_LINKS_COMPLETE:
      const links = {};
      action.links.forEach((link) => {
        links[link._id] = link;
      });
      return {
        loading: false,
        error: '',
        data: links
      };

    default:
      return state;
  }
}

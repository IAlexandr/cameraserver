import {
  linksActionTypes
} from '../actions';

const {
  LOAD_LINKS,
  LOAD_LINKS_FAILED,
  LOAD_LINKS_COMPLETE,

  ADD_LINK_COMPLETE,
  ADD_LINK_FAILED,
  ADD_LINK,
} = linksActionTypes;

const initialState = {
  error: '',
  loading: false,
  data: {},
  sending: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOAD_LINKS:
      return Object.assign(state, {
        loading: true,
        error: ''
      });

    case LOAD_LINKS_FAILED:
      return Object.assign(state, {
        loading: false,
        error: action.err
      });

    case LOAD_LINKS_COMPLETE:
      const links = {};
      action.links.forEach((link) => {
        links[link._id] = link;
      });
      return Object.assign(state, {
        loading: false,
        error: '',
        data: links
      });

    case ADD_LINK:
      return Object.assign(state, {
        sending: true,
        error: ''
      });

    case ADD_LINK_FAILED:
      return Object.assign(state, {
        sending: false,
        error: action.err
      });

    case ADD_LINK_COMPLETE:
      const data = Object.assign({}, state.data);
      data[action.link._id] = action.link;
      return Object.assign(state, {
        sending: false,
        error: '',
        data: data
      });

    default:
      return state;
  }
}

import superagent from 'superagent';

export const actionTypes = {
  LOAD_LINKS_COMPLETE: 'LOAD_LINKS_COMPLETE',
  LOAD_LINKS_FAILED: 'LOAD_LINKS_FAILED',
  LOAD_LINKS: 'LOAD_LINKS',

  ADD_LINK_COMPLETE: 'ADD_LINK_COMPLETE',
  ADD_LINK_FAILED: 'ADD_LINK_FAILED',
  ADD_LINK: 'ADD_LINK',
};

export function loadLinksComplete (links) {
  return {
    type: actionTypes.LOAD_LINKS_COMPLETE,
    links
  };
}

export function loadLinksFailed (err) {
  return {
    type: actionTypes.LOAD_LINKS_FAILED,
    err
  };
}

export function loadLinks () {
  return dispatch => {
    dispatch({
      type: actionTypes.LOAD_LINKS
    });

    superagent.get('http://localhost:4000/api/links')
      .accept('application/json')
      .end((err, res) => {
        if (err) {
          dispatch(loadLinksFailed(err));
        } else {
          setTimeout(() => dispatch(loadLinksComplete(res.body)), 1000);
        }
      });
  };
}

export function addLinkComplete (link) {
  return {
    type: actionTypes.ADD_LINK_COMPLETE,
    link
  };
}

export function addLinkFailed (err) {
  return {
    type: actionTypes.ADD_LINK_FAILED,
    err
  };
}

export function addLink (data) {
  return dispatch => {
    dispatch({
      type: actionTypes.ADD_LINK
    });

    superagent.post('http://localhost:4000/api/links')
      .send(data)
      .accept('application/json')
      .end((err, res) => {
        if (err) {
          dispatch(addLinkFailed(err));
        } else {
          dispatch(addLinkComplete(res.body));
        }
      });
  };
}

export const actions = {
  loadLinksComplete,
  loadLinksFailed,
  loadLinks,

  addLinkComplete,
  addLinkFailed,
  addLink
};
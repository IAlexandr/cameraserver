import superagent from 'superagent';

export const actionTypes = {
  LOAD_LINKS_COMPLETE: 'LOAD_LINKS_COMPLETE',
  LOAD_LINKS_FAILED: 'LOAD_LINKS_FAILED',
  LOAD_LINKS: 'LOAD_LINKS',
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

export function loadLinks (callback) {
  return dispatch => {
    dispatch({
      type: actionTypes.LOAD_LINKS
    });

    superagent.get('http://localhost:4000/api/links')
      .accept('application/json')
      .end((err, res) => {
        if (callback) {
          callback(err, !err ? JSON.parse(res.body) : null);
        }
        if (err) {
          dispatch(loadLinksFailed(err));
        } else {
          dispatch(loadLinksComplete(res.body));
        }
      });
  };
}

export const actions = {
  loadLinksComplete,
  loadLinksFailed,
  loadLinks
};
import React, { Component, PropTypes } from 'react';

const styles = {
  video: {
    width: 640,
    height: 360
  }
};

export default class CameraTypes extends Component {
  static propTypes = {
    cameraTypes: PropTypes.object
  };

  render () {

    return (
      <div>
        CameraTypes
      </div>
    );
  }
}

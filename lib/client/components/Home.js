import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import { cameraTypesActions, camerasActions } from './../actions';

class Home extends Component {
  constructor (props) {
    super(props);
    this.props.loadCameraTypes();
    this.props.loadCameras();
  }

  static propTypes = {
    cameraTypes: PropTypes.object,
    cameras: PropTypes.object
  };

  render () {
    return (
      <div>
        HOME!
        <FlatButton
          label="Проверить"
          disabled={false}
          primary={true}
          onClick={() => {
            console.log('Проверить!');
          }}
        />
        <h3>CameraTypes</h3>
        <pre>
          {JSON.stringify(this.props.cameraTypes, null, 2)}
        </pre>
        <h3>Cameras</h3>
        <pre>
          {JSON.stringify(this.props.cameras, null, 2)}
        </pre>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    cameraTypes: state.cameraTypes,
    cameras: state.cameras,
  };
}

export default connect(mapStateToProps, {
  loadCameraTypes: cameraTypesActions.loadCameraTypes,
  loadCameras: camerasActions.loadCameras,
})(Home);

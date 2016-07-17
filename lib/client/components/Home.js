import React, { Component, PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import { connect } from 'react-redux';
import { cameraTypesActions } from './../actions';

class Home extends Component {
  constructor (props) {
    super(props);
    this.props.loadCameraTypes();
  }

  static propTypes = {
    cameraTypes: PropTypes.object
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
        <pre>
          {JSON.stringify(this.props.cameraTypes, null, 2)}
        </pre>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    cameraTypes: state.cameraTypes
  };
}

export default connect(mapStateToProps, {
  loadCameraTypes: cameraTypesActions.loadCameraTypes
})(Home);

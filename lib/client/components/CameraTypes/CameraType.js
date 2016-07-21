import React, {Component, PropTypes} from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import styles from './../../utils/styles';
import Paper from 'material-ui/Paper';

export default class CameraTypes extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    cameraType: PropTypes.object
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  render () {
    if (this.props.loading) {
      return (
        <LinearProgress mode="indeterminate"/>
      );
    }
    return (
      <div style={{ height: '100%', textAlign: 'center' }}>
        <Paper style={styles.paper} zDepth={1}>
          {this.props.cameraType.name || 'Нет такого типа камеры'}
        </Paper>
      </div>
    );
  }
}

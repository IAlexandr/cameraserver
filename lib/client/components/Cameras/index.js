import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import Paper from 'material-ui/Paper';
import styles from './../../utils/styles';
import DynaTable from './../../utils/DynaTable';
import {camerasActions, cameraTypesActions} from './../../actions';
import FlatButton from 'material-ui/FlatButton';

class Cameras extends Component {
  constructor (props) {
    super(props);
    this.props.loadCameras();
    this.props.loadCameraTypes();
  }

  static propTypes = {
    cameras: PropTypes.object,
    cameraTypes: PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  prepCamerasTable () {
    let component;
    const buttons = [];
    if (this.props.cameras.loading) {
      component = (
        <LinearProgress mode="indeterminate"/>
      );
    } else {
      const cameras = this.props.cameras;
      const definition = {
        columns: {
          'name': {
            alias: 'Наименование',
            order: 1
          },
          query: {
            alias: 'Дополнительные параметры',
            order: 2
          },
          ip: {
            alias: 'IP',
            order: 3
          },
          cameraTypeId: {
            alias: 'Тип',
            order: 4
          }
        },
        showExpression: (obj) => {
          return true; // TODO сделать фильтр
        },
        onRowSelection: (selectedIndexes) => {
          if (selectedIndexes.length > 0) {
            // TODO херня, переделать
            var data = Object.keys(cameras.data).map((cameraId) => { return cameras.data[cameraId]});
            this.context.router.push('/cameras/' + data[selectedIndexes[0]]._id);
          }
        }
      };

      component = (
        <DynaTable
          definition={definition}
          data={Object.keys(cameras.data).map((cameraId) => { return cameras.data[cameraId]})}
        />
      );

      buttons.push(
        <FlatButton
          key="add"
          label="Добавить"
          secondary={true}
          onClick={() => {
            console.log('Добавление новой камеры');
            this.context.router.push('/cameras/new');
          }}
        />
      );
    }
    return (
      <div>
        {buttons}
        {component}
      </div>
    );
  };

  render () {
    if (this.props.children) {
      return React.cloneElement(this.props.children, {
        loading: this.props.cameras.loading,
        camera: this.props.cameras.data[this.props.params.cameraId] || {},
        saveAction: this.props.upsertCamera
      });
    }
    return (
      <div style={{ height: '100%', textAlign: 'center' }}>
        <Paper style={styles.paper} zDepth={1}>
          {this.prepCamerasTable()}
        </Paper>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    cameras: state.cameras,
    cameraTypes: state.cameraTypes
  };
}

export default connect(mapStateToProps, {
  loadCameras: camerasActions.loadCameras,
  loadCameraTypes: cameraTypesActions.loadCameraTypes,
  upsertCamera: camerasActions.upsertCamera,
})(Cameras);
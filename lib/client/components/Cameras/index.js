import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import Paper from 'material-ui/Paper';
import styles from './../../utils/styles';
import DynaTable from './../../utils/DynaTable';
import {camerasActions, cameraTypesActions, smessagesActions, cameraCodersActions} from './../../actions';
import FlatButton from 'material-ui/FlatButton';
import VideoCamIcon from 'material-ui/svg-icons/av/videocam';
import VideoCamOffIcon from 'material-ui/svg-icons/av/videocam-off';
import CreateIcon from 'material-ui/svg-icons/content/create';

class Cameras extends Component {
  constructor (props) {
    super(props);

  }

  static propTypes = {
    cameras: PropTypes.object,
    cameraTypes: PropTypes.object,
    cameraCoders: PropTypes.object,
    openMessage: PropTypes.func
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.loadCameras();
    this.props.loadCameraTypes();
    this.props.loadCameraCoders();
  }

  prepCamerasTable () {
    const _this = this;
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
            alias: 'Доп. параметры',
            order: 2
          },
          username: {
            alias: 'логин',
            order: 3
          },
          password: {
            alias: 'пароль',
            order: 4
          },
          ip: {
            alias: 'IP',
            order: 5
          },
          cameraTypeId: {
            alias: 'Тип',
            order: 6,
            preProcessing: (value) => {
              return _this.props.cameraTypes.data[value] ? _this.props.cameraTypes.data[value].name : value;
            }
          }
        },
        buttons: [
          {
            icon: (<VideoCamIcon />),
            style: {color: 'green', minWidth: 36, width: 36},
            onClick: (camera) => {
              _this.props.stopCameraCoder(camera._id);
            },
            showExpression: (camera) => {
              if (Object.keys(_this.props.cameraCoders.data).length > 0) {
                const ccInfo = _this.props.cameraCoders.data[camera._id];
                if (ccInfo && ccInfo.isWorking) {
                  return true;
                }
              }
              return false;
            }
          },
          {
            icon: (<VideoCamOffIcon />),
            style: {color: 'red', minWidth: 36, width: 36},
            onClick: (camera) => {
              _this.props.startCameraCoder(camera._id);
            },
            showExpression: (camera) => {
              if (Object.keys(_this.props.cameraCoders.data).length > 0) {
                const ccInfo = _this.props.cameraCoders.data[camera._id];
                if (ccInfo && !ccInfo.isWorking) {
                  return true;
                }
              }
              return false;
            }
          },
          {
            icon: (<CreateIcon />),
            style: { color: 'orange', minWidth: 36, width: 36 },
            onClick: (camera) => {
              _this.context.router.push('/cameras/' + camera._id);
            },
            showExpression: (camera) => {
              return true;
            }
          }
        ],
        showExpression: (obj) => {
          return true; // TODO сделать фильтр
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
        cameraTypes: this.props.cameraTypes || {},
        saveAction: this.props.upsertCamera,
        deleteAction: this.props.deleteCamera,
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
    cameraTypes: state.cameraTypes,
    cameraCoders: state.cameraCoders,
  };
}

export default connect(mapStateToProps, {
  loadCameras: camerasActions.loadCameras,
  loadCameraTypes: cameraTypesActions.loadCameraTypes,
  loadCameraCoders: cameraCodersActions.loadCameraCoders,
  upsertCamera: camerasActions.upsertCamera,
  deleteCamera: camerasActions.deleteCamera,
  openMessage: smessagesActions.openMessage,
  stopCameraCoder: cameraCodersActions.stopCameraCoder,
  startCameraCoder: cameraCodersActions.startCameraCoder,
})(Cameras);

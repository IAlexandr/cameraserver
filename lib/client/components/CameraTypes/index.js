import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import Paper from 'material-ui/Paper';
import styles from './../../utils/styles';
import DynaTable from './../../utils/DynaTable';
import {cameraTypesActions} from './../../actions';

class CameraTypes extends Component {
  constructor (props) {
    super(props);
    this.props.loadCameraTypes();
  }

  static propTypes = {
    cameraTypes: PropTypes.object
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  prepCameraTypesTable () {
    let component;
    if (this.props.cameraTypes.loading) {
      component = (
        <LinearProgress mode="indeterminate"/>
      );
    } else {
      const cameraTypes = this.props.cameraTypes;
      const definition = {
        columns: {
          'name': {
            alias: 'Наименование',
            order: 1
          },
          rtspUrlTail: {
            alias: 'Параметры подключения',
            order: 2
          }
        },
        showExpression: (obj) => {
          return true; // TODO сделать фильтр
        },
        onRowSelection: (selectedIndexes) => {
          if (selectedIndexes.length > 0) {
            // TODO херня, переделать
            var data = Object.keys(cameraTypes.data).map((cameraTypeId) => { return cameraTypes.data[cameraTypeId]});
            this.context.router.push('/camera-types/' + data[selectedIndexes[0]]._id);
          }
        }
      };

      component = (
        <DynaTable
          definition={definition}
          data={Object.keys(cameraTypes.data).map((cameraTypeId) => { return cameraTypes.data[cameraTypeId]})}
        />
      );
    }
    return (
      <div>
        {component}
      </div>
    );
  };

  render () {
    if (this.props.children) {
      return React.cloneElement(this.props.children, {
        loading: this.props.cameraTypes.loading,
        cameraType: this.props.cameraTypes.data[this.props.params.cameraTypeId] || {}
        // TODO save Action
      });
    }
    return (
      <div style={{ height: '100%', textAlign: 'center' }}>
        <Paper style={styles.paper} zDepth={1}>
          {this.prepCameraTypesTable()}
        </Paper>
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
  loadCameraTypes: cameraTypesActions.loadCameraTypes,
  upsertCameraType: cameraTypesActions.upsertCameraType,
})(CameraTypes);
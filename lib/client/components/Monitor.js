import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {cameraTypesActions, camerasActions, linksActions} from './../actions';
import Player from './Player';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';
import styles from './../utils/styles';
import FlatButton from 'material-ui/FlatButton';
import TimePicker from 'material-ui/TimePicker';
import HardwareVideogameAsset from 'material-ui/svg-icons/hardware/videogame-asset';

class Home extends Component {
  constructor (props) {
    super(props);
    this.props.loadCameraTypes();
    this.props.loadCameras();
    this.props.loadLinks();
    this.state = {
      selectedLinkId: null,
      selectedCameraId: null,
      mpdUrl: null
    }
  }

  static propTypes = {
    cameraTypes: PropTypes.object,
    cameras: PropTypes.object,
    links: PropTypes.object
  };

  loadingCheck (info) {
    if (info.loading) {
      return (
        <LinearProgress mode="indeterminate"/>
      );
    }
    return false;
  }

  handleChangeLink (value) {
    this.setState({
      selectedLinkId: value,
      mpdUrl: this.props.links.data[value].mpdUrl
    });
  }

  handleChangeCamera (cameraId) {
    this.setState({
      selectedCameraId: cameraId,
      mpdUrl: '/api/mpds/' + cameraId + '/mpd'
    });
  }

  prepSelector (label, sourceName, stateSelectedId, handleChange) {
    const _this = this;
    const source = this.props[sourceName];
    if (source.loading) {
      return (
        <LinearProgress mode="indeterminate"/>
      );
    }
    const menuItems = Object.keys(source.data).map((objId) => {
      return (
        <MenuItem key={objId} value={objId} primaryText={source.data[objId].name}/>
      );
    });
    return (
      <SelectField
        value={this.state[stateSelectedId]}
        floatingLabelFixed={true}
        onChange={
          (event, index, value) => {
            handleChange(value);
          }
        }
        floatingLabelText={label}
      >
        {menuItems}
      </SelectField>
    );
  }

  prepMonitor () {
    // {this.state.mpdUrl}
    return (
      <div>
        <Paper style={styles.paper} zDepth={1}>
          {/*{this.prepSelector('ссылка', 'links', 'selectedLinkId', this.handleChangeLink.bind(this))}*/}
          {this.prepSelector('камера', 'cameras', 'selectedCameraId', this.handleChangeCamera.bind(this))}
          <Player mpdUrl={this.state.mpdUrl}/>
          <Paper>
            <TimePicker
              format="24hr"
              hintText="Начало периода"
              ref="startTime"
              onChange={
                (oldDate, newDate) => {
                  console.log(newDate);
                }
              }
            />
            <TimePicker
              format="24hr"
              hintText="Окончание периода"
              ref="endTime"
              onChange={
                (oldDate, newDate) => {
                  console.log(newDate);
                }
              }
            />
            <FlatButton
              icon={<HardwareVideogameAsset />}
              onClick={(e) => {
                // TODO
                const startTime = this.refs.startTime.state.time.toISOString();
                const endTime = this.refs.endTime.state.time.toISOString();
                console.log('archive!!', startTime, endTime);
                this.setState({
                  mpdUrl: '/api/mpds/' + this.state.selectedCameraId + '/mpd?startTime=' + startTime + '&endTime=' + endTime
                });
              }}
            />
          </Paper>
        </Paper>
      </div>
    );
  }

  render () {
    return (
      <div style={{ height: '100%', textAlign: 'center' }}>
        {/*<FlatButton*/}
        {/*label="Добавить видео ссылку"*/}
        {/*disabled={false}*/}
        {/*primary={true}*/}
        {/*onClick={() => {*/}
        {/*console.log('Добавить видео ссылку!');*/}
        {/*this.props.addLink({ mpdUrl: '123123', name: 'asdasd' });*/}
        {/*}}*/}
        {/*/>*/}
        {/*<br />*/}
        {/*Кол-во камер: {Object.keys(this.props.cameras.data).length}*/}
        {/*<br />*/}
        {/*Кол-во типов: {Object.keys(this.props.cameraTypes.data).length}*/}
        {/*<br />*/}
        {/*Кол-во ссылок: {Object.keys(this.props.links.data).length}*/}
        {/*<br />*/}
        {this.prepMonitor()}
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    cameraTypes: state.cameraTypes,
    cameras: state.cameras,
    links: state.links,
  };
}

export default connect(mapStateToProps, {
  loadCameraTypes: cameraTypesActions.loadCameraTypes,
  loadCameras: camerasActions.loadCameras,
  loadLinks: linksActions.loadLinks,
  addLink: linksActions.addLink,
})(Home);

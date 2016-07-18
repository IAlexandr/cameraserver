import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import {connect} from 'react-redux';
import {cameraTypesActions, camerasActions, linksActions} from './../actions';
import Player from './Player';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';

const styles = {
  paper: {
    height: 600,
    width: 800,
    margin: 0,
    textAlign: 'center',
    display: 'inline-block',
  }
};

class Home extends Component {
  constructor (props) {
    super(props);
    this.props.loadCameraTypes();
    this.props.loadCameras();
    this.props.loadLinks();
    this.state = {
      selectedLinkId: null,
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
  }

  handleChangeLink (event, index, value) {
    this.setState({
      selectedLinkId: value,
      mpdUrl: this.props.links.data[value].mpdUrl
    });
  }

  prepLinkSelector () {
    this.loadingCheck(this.props.links);
    const menuItems = Object.keys(this.props.links.data).map((linkId) => {
      return (
        <MenuItem key={linkId} value={linkId} primaryText={this.props.links.data[linkId].name}/>
      );
    });
    return (
      <SelectField value={this.state.selectedLinkId} onChange={this.handleChangeLink.bind(this)}>
        {menuItems}
      </SelectField>
    );
  }

  prepMonitor () {

    return (
      <div>
        <Paper style={styles.paper} zDepth={1}>
          {this.prepLinkSelector()}
          <Player mpdUrl={this.state.mpdUrl}/>
        </Paper>
      </div>
    );
  }

  render () {
    return (
      <div>
        <FlatButton
          label="Добавить видео ссылку"
          disabled={false}
          primary={true}
          onClick={() => {
            console.log('Добавить видео ссылку!');
          }}
        />
        {/*<h3>CameraTypes</h3>*/}
        {/*<pre>*/}
        {/*{JSON.stringify(this.props.cameraTypes, null, 2)}*/}
        {/*</pre>*/}
        {/*<h3>Cameras</h3>*/}
        {/*<pre>*/}
        {/*{JSON.stringify(this.props.links, null, 2)}*/}
        {/*</pre>*/}
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
})(Home);

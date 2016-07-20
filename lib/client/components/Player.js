import React, { Component, PropTypes } from 'react';

const styles = {
  video: {
    width: 640,
    height: 360
  }
};

export default class Player extends Component {
  static propTypes = {
    mpdUrl: PropTypes.string
  };

  render () {
    const mpdUrl = this.props.mpdUrl;
    const context = new Dash.di.DashContext();
    const player = new MediaPlayer(context);
    player.startup();
    player.attachView(this.refs.videoPlayer);
    player.setAutoPlay(true);
    player.attachSource(mpdUrl);
    return (
      <div>
        <video ref="videoPlayer" style={styles.video} controls></video>
      </div>
    );
  }
}

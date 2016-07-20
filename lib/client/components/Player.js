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
    // if (!this.props.mpdUrl) {
    //   return (
    //     <div>Нет ссылки на подключение к видеопотоку</div>
    //   );
    // }

    const mpdUrl = this.props.mpdUrl;
    // var player = dashjs.MediaPlayer().create();
    // player.initialize(this.refs.videoPlayer, mpdUrl, true);
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

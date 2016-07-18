import React, { Component, PropTypes } from 'react';

const styles = {
  video: {
    width: 640,
    height: 360
  }
};

export default class Player extends Component {
  static propTypes = {
    mpdUrl: PropTypes.object
  };

  render () {
    // if (!this.props.mpdUrl) {
    //   return (
    //     <div>Нет ссылки на подключение к видеопотоку</div>
    //   );
    // }

    const mpdUrl = this.props.mpdUrl ||  "http://dash.edgesuite.net/envivio/EnvivioDash3/manifest.mpd";
    var player = dashjs.MediaPlayer().create();
    player.initialize(this.refs.videoPlayer, mpdUrl, true);
    return (
      <div>
        <video ref="videoPlayer" style={styles.video} controls></video>
      </div>
    );
  }
}

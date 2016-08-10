import React, { Component, PropTypes } from 'react';
import styles from './../utils/styles';

export default class Player extends Component {
  static propTypes = {
    mpdUrl: PropTypes.string
  };

  constructor (props) {
    super(props);
    this.state = {
      player: null,
      mpdUrl: null
    };
  }
  componentDidMount() {
    console.log('componentDidMount');
  }
  componentWillReceiveProps (nextProps) {
    console.log('componentWillReceiveProps', nextProps);
    if (nextProps.mpdUrl) {
      if (this.state.mpdUrl !== nextProps.mpdUrl) {
        if (this.state.player) {
          this.state.player.reset();
        }
        this.setState({
          player: this.prepPlayer(nextProps.mpdUrl),
          mpdUrl: nextProps.mpdUrl
        });
      }
    }

  }
  componentWillUnmount() {
    console.log('componentWillUnmount');
    if (this.state.player) {
      this.state.player.reset();
    }
  }

  prepPlayer (mpdUrl) {
    const player = dashjs.MediaPlayer().create();
    player.initialize(this.refs.videoPlayer, mpdUrl, true);
    return player;
  }

  render () {
    return (
      <div>
        {this.state.mpdUrl}
        <video ref="videoPlayer" style={styles.video} controls></video>
      </div>
    );
  }
}

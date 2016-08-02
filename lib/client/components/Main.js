import React, {Component, PropTypes} from 'react';
import IconButton from 'material-ui/IconButton';
import Reorder from 'material-ui/svg-icons/action/reorder';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import {connect} from 'react-redux';
import {smessagesActions} from './../actions';

export default class Monitor extends Component {
  constructor (props) {
    super(props);
    this.state = {
      openMenu: false
    }
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
    sOpen: PropTypes.bool,
    sMessage: PropTypes.string,
    closeMessage: PropTypes.foo,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  static contextTypes = {
    history: PropTypes.object.isRequired
  };

  handleToggle () {
    this.setState({ openMenu: !this.state.openMenu });
  }

  goTo (route) {
    return () => {
      this.setState({ openMenu: false });
      this.context.history.push(route);
    }
  }
  handleRequestClose() {
    // TODO action.CLOSE_MESSAGE
    this.props.closeMessage();
  }
  render () {
    return (
      <div>
        <IconButton
          tooltip="Меню"
          onClick={this.handleToggle.bind(this)}
        >
          <Reorder />
        </IconButton>
        <Drawer
          docked={false}
          width={200}
          open={this.state.openMenu}
          onRequestChange={(open) => this.setState({ open })}
        >
          <MenuItem onClick={this.goTo('/').bind(this)}>Монитор</MenuItem>
          <MenuItem onClick={this.goTo('/camera-types').bind(this)}>Типы камер</MenuItem>
          <MenuItem onClick={this.goTo('/cameras').bind(this)}>Камеры</MenuItem>
          <MenuItem onClick={this.goTo('/links').bind(this)}>Ссылки</MenuItem>
        </Drawer>
        <div>
          { this.props.children }
        </div>
        <Snackbar
          open={this.props.sOpen}
          message={this.props.sMessage}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    sMessage: state.smessages.message,
    sOpen: state.smessages.open
  };
}

export default connect(mapStateToProps, {
  closeMessage: smessagesActions.closeMessage,
})(Monitor);

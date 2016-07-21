import React, {Component, PropTypes} from 'react';
import IconButton from 'material-ui/IconButton';
import Reorder from 'material-ui/svg-icons/action/reorder';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

export default class Base extends Component {
  constructor (props) {
    super(props);
    this.state = {
      openMenu: false
    }
  }

  static propTypes = {
    location: PropTypes.object.isRequired,
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
      </div>
    );
  }
}

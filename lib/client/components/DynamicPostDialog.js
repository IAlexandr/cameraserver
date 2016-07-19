import React, {Component, PropTypes} from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

class DynamicPostDialog extends Component{

  constructor () {
    this.state = {
      open: false
    }
  }

  static propTypes = {
    title: PropTypes.string,
    form: PropTypes.element,
    handleSave: PropTypes.func,
    buttonLabel: PropTypes.string
  };

  handleOpen () {
    this.setState({ open: true });
  }

  handleClose () {
    this.setState({ open: false });
  }

  handleLoad () {
    this.props.handleLoad();
    this.handleClose();
  }

  render() {
    const actions = [
      <FlatButton
        label="Отменить"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Загрузить"
        secondary={true}
        keyboardFocused={true}
        onTouchTap={this.handleLoad}
      />,
    ];

    return (
      <FlatButton secondary={true} label={this.props.buttonLabel || 'Загрузить'} disabled={this.props.disabled} onTouchTap={this.handleOpen}>
        <Dialog
          title={this.props.title}
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {this.props.description}
        </Dialog>
      </FlatButton>
    );
  }
}



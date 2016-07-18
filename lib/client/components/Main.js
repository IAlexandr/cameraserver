import React, { Component, PropTypes } from 'react';

export default class Base extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  render () {
    return (
      <div style={{ height: '100%', textAlign: 'center' }}>
        <h3></h3>
        { this.props.children }
      </div>
    );
  }
}

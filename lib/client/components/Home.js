import React, { Components } from 'react';
import FlatButton from 'material-ui/FlatButton';

class Home extends React.Component {
  render () {
    return (
      <div>
        HOME!
        <FlatButton
          label="Проверить"
          disabled={false}
          primary={true}
          onClick={() => {
            console.log('Проверить!');
          }}
        />
      </div>
    );
  }
}

export default Home;

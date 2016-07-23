import React, {Component, PropTypes} from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import styles from './../../utils/styles';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

export default class CameraTypes extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    cameraType: PropTypes.object,
    saveAction: PropTypes.func
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  prepForm () {

    return (
      <div>
        <TextField
          hintText="Наименование"
          floatingLabelText="Наименование типа камеры"
          floatingLabelFixed={true}
          onChange={(e) => {
            this.setState({
              typeName: e.target.value
            });
          }}
          defaultValue={this.props.cameraType.name}
        /><br />
        <TextField
          hintText="rtspUrlTail"
          floatingLabelText="Параметры подключения"
          floatingLabelFixed={true}
          onChange={(e) => {
            this.setState({
              rtspUrlTail: e.target.value
            });
          }}
          defaultValue={this.props.cameraType.rtspUrlTail}
        /><br />
        <FlatButton
          label="Сохранить"
          secondary={true}
          onClick={(() => {
            console.log('Сохранение изменений');
            const rtspUrlTail = this.state.rtspUrlTail;
            const name = this.state.typeName;
            const saveObj = {...this.props.cameraType, ...{ rtspUrlTail, name }};
            this.props.saveAction(saveObj);
          }).bind(this)}
        />
      </div>
    );
  }

  render () {
    if (this.props.loading) {
      return (
        <LinearProgress mode="indeterminate"/>
      );
    }
    if (!this.props.cameraType && this.props.params.cameraTypeId !== 'new') {
      return <div>Нет такого типа камеры</div>
    }
    let title = (<h3>Редактирование типа камеры "{this.props.cameraType.name}"</h3>);
    if (this.props.params.cameraTypeId === 'new') {
      title = (<h3>Добавление типа камеры</h3>);
    }
    return (
      <div style={{ height: '100%', textAlign: 'center' }}>
        <Paper style={styles.paper} zDepth={1}>
          {title}
          {this.prepForm()}
        </Paper>
      </div>
    );
  }
}

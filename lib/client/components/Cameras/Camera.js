import React, {Component, PropTypes} from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import styles from './../../utils/styles';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

export default class Camera extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    camera: PropTypes.object,
    saveAction: PropTypes.func
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount () {
    this.setState(this.props.camera);
  }
  prepForm () {

    return (
      <div>
        <TextField
          hintText="Наименование"
          floatingLabelText="Наименование камеры"
          floatingLabelFixed={true}
          onChange={(e) => {
            this.setState({
              cameraName: e.target.value
            });
          }}
          defaultValue={this.props.camera.name}
        /><br />
        <TextField
          hintText="Адрес подключения"
          floatingLabelText="IP"
          floatingLabelFixed={true}
          onChange={(e) => {
            this.setState({
              ip: e.target.value
            });
          }}
          defaultValue={this.props.camera.ip}
        /><br />
        <TextField
          hintText="Дополнительные параметры"
          floatingLabelText="Параметры подключения"
          floatingLabelFixed={true}
          onChange={(e) => {
            this.setState({
              query: e.target.value
            });
          }}
          defaultValue={this.props.camera.query}
        /><br />
        // SELECT FIELD Тип камеры
        <FlatButton
          label="Сохранить"
          secondary={true}
          onClick={(() => {
            console.log('Сохранение изменений');
            const query = this.state.query;
            const ip = this.state.ip;
            const name = this.state.cameraName;
            const cameraTypeId = this.state.cameraTypeId;
            const saveObj = {...this.props.camera, ...{ query, name, ip, cameraTypeId }};
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
    if (!this.props.camera && this.props.params.cameraId !== 'new') {
      return <div>Нет такой камеры</div>
    }
    let title = (<h3>Редактирование камеры "{this.props.camera.name}"</h3>);
    if (this.props.params.cameraTypeId === 'new') {
      title = (<h3>Добавление камеры</h3>);
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

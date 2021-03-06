import React, {Component, PropTypes} from 'react';
import LinearProgress from 'material-ui/LinearProgress';
import styles from './../../utils/styles';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class Camera extends Component {

  constructor (props) {
    super(props);
    this.state = {
      cameraTypeId: props.camera.cameraTypeId,
      cameraName: props.camera.name,
      ip: props.camera.ip,
      query: props.camera.query,
      username: props.camera.username,
      password: props.camera.password,
    };
  }

  static propTypes = {
    loading: PropTypes.bool,
    camera: PropTypes.object,
    cameraTypes: PropTypes.object,
    saveAction: PropTypes.func,
    deleteAction: PropTypes.func,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentDidMount () {
    this.setState(this.props.camera);
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      cameraTypeId: nextProps.camera.cameraTypeId,
      cameraName: nextProps.camera.name,
      ip: nextProps.camera.ip,
      query: nextProps.camera.query,
      username: nextProps.camera.username,
      password: nextProps.camera.password,
    });
  }

  prepTypeSelect () {
    const items = Object.keys(this.props.cameraTypes.data).map((typeId, i) => {
      return (
        <MenuItem key={i} value={typeId} primaryText={this.props.cameraTypes.data[typeId].name} />
      );
    });

    return (
      <SelectField
        value={this.state.cameraTypeId}
        defaultValue={this.props.camera.cameraTypeId}
        floatingLabelFixed={true}
        onChange={
          (event, index, value) => {
            this.setState({
              cameraTypeId: value
            });
          }
        }
        floatingLabelText='Тип камеры'
        maxHeight={200}>
        {items}
      </SelectField>
    );
  }
  prepButtons() {
    let deleteButton;
    if (this.props.camera._id) {
      deleteButton = (
        <FlatButton
          label="Удалить"
          secondary={true}
          onClick={(() => {
            console.log('Удаление камеры');
            this.props.deleteAction(this.props.camera._id);
            this.context.router.push('/cameras');
          }).bind(this)}
        />
      );
    }
    return (
      <div>
        {deleteButton}
        <FlatButton
          label="Сохранить"
          primary={true}
          onClick={(() => {
            console.log('Сохранение изменений');
            const query = this.state.query;
            const username = this.state.username;
            const password = this.state.password;
            const ip = this.state.ip;
            const name = this.state.cameraName;
            const cameraTypeId = this.state.cameraTypeId;
            const saveObj = {...this.props.camera, ...{ query, name, ip, cameraTypeId, password, username }};
            this.props.saveAction(saveObj);
            this.context.router.push('/cameras');
          }).bind(this)}
        />
      </div>
    );
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
        <TextField
          hintText="Логин"
          floatingLabelText="Логин"
          floatingLabelFixed={true}
          onChange={(e) => {
            this.setState({
              username: e.target.value
            });
          }}
          defaultValue={this.props.camera.username}
        /><br />
        <TextField
          hintText="Пароль"
          floatingLabelText="Пароль"
          floatingLabelFixed={true}
          onChange={(e) => {
            this.setState({
              password: e.target.value
            });
          }}
          defaultValue={this.props.camera.password}
        /><br />
        {this.prepTypeSelect()}
        {this.prepButtons()}
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
    let message;
    if (this.props.params.cameraTypeId === 'new') {
      title = (<h3>Добавление камеры</h3>);
    } else {
      message = (
        <div style={{ color: 'orange', fontSize: 12 }}>
          Внимание! Если исправить поля касающиеся настройки подключения, для того чтобы изменения вступили в силу перезапустите запись.
        </div>
      );
    }
    return (
      <div style={{ height: '100%', textAlign: 'center' }}>
        <Paper style={styles.paper} zDepth={1}>
          {title}
          {message}
          {this.prepForm()}
        </Paper>
      </div>
    );
  }
}

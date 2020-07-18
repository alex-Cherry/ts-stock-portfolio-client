////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////
import React from 'react';
import { AnyAction } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { withRouter, RouteComponentProps } from 'react-router-dom';
// import custom components
import Card, { CardContent, CardActions, CardErrors } from '../card';
import { Input } from '../inputs';
import Button from '../button';
import TextInput from './textInput';
import NotiticationWithTransfer from '../notiticationWithTransfer';
// import actions
import { register } from '../../store/auth/action';
// import input checker
import { email, required, minLength } from '../../utils/inputChecker/validators';
import { ValidationsRuleType } from '../../utils/inputChecker/validate';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type RegiseterComponentExtraProps = {}

type RegiseterComponentState = {
  loading: boolean,
  error: string,
  email: string,
  isEmailValid: boolean,
  emailValidations: ValidationsRuleType,
  password: string,
  isPasswordValid: boolean,
  passwordValidations: ValidationsRuleType,
  username: string,
  isUsernameValid: boolean,
  usernameValidations: ValidationsRuleType,
  confirmPassword: string,
  registrationSuccess: boolean,
  touched: boolean
}

// DISPATCH
const mapDispatch = (dispatch: ThunkDispatch<void, unknown, AnyAction>) => {
  return {
    register: (email: string, password: string, username: string): Promise<void> => dispatch(register(email, password, username))
  }
}

const connector = connect(null, mapDispatch);
type RegisterComponentProps = ConnectedProps<typeof connector>
  & RouteComponentProps
  & RegiseterComponentExtraProps;


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class RegisterComponent extends React.Component<RegisterComponentProps, RegiseterComponentState> {

  private mounted: boolean = false;

  state: RegiseterComponentState = {
    // email
    email: '',
    isEmailValid: false,
    emailValidations: {
      required: { rule: required, msg: `Поле 'Email' не заполнено.` },
      email: { rule: email, msg: `Поле 'Email' не корректно.` }
    },
    // username
    username: '',
    isUsernameValid: false,
    usernameValidations: {
      required: { rule: required, msg: `Поле 'Username' не заполнено.` }
    },
    // password
    password: '',
    isPasswordValid: false,
    passwordValidations: {
      required: { rule: required, msg: `Поле 'Password' не заполнено.` },
      minLength: { rule: minLength(6), msg: `Поле 'Password' долно содержать не менее 6 символов.` }
    },
    // others
    confirmPassword: '',
    registrationSuccess: false,
    touched: false,
    loading: false,
    error: ''
  }

  // LIFECYCLE
  componentDidMount = () => {
    this.setLoading(false);
    this.setError('');
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
  }


  // EVENT HANDLERS
  //  => Email
  onChangeEmailHandler = (data: string, valid: boolean) => {
    this.setState({
      email: data.trim(),
      isEmailValid: valid
    });
  }
  onPressEnterEmailHandler = () => {
    this.doSubmit();
  }
  //  => Username
  onChangeUsernameHandler = (data: string, valid: boolean) => {
    this.setState({
      username: data.trim(),
      isUsernameValid: valid
    });
  }
  onPressEnterUsernameHandler = () => {
    this.doSubmit();
  }
  //  => Password
  onChangePasswordHandler = (data: string, valid: boolean) => {
    this.setState({
      password: data.trim(),
      isPasswordValid: valid
    });
  }
  onPressEnterPasswordHandler = () => {
    this.doSubmit();
  }
  //  => Confirm Password
  onChangeConfirmPasswordHandler = (data: string) => {
    this.setState({
      confirmPassword: data
    });
  }
  //  => Submit
  onClickSubmitHandler = () => {
    this.doSubmit();
  }

  // UTILS
  isValid = (): boolean => {
    const { isEmailValid, isPasswordValid, isUsernameValid } = this.state;
    return isEmailValid && isPasswordValid && isUsernameValid;
  }
  hasData = (): boolean => {
    const { email, password, username } = this.state;
    return !!email.trim() && !!password.trim() && !!username.trim();
  }
  setLoading = (value: boolean): void => {
    this.setState({
      loading: value
    });
  }
  setError = (msg: string): void => {
    this.setState({
      error: msg
    });
  }
  doSubmit = async (): Promise<void> => {
    // all fields must be completed
    if (!this.hasData()) {
      this.setState({ touched: true });
      return;
    }
    // all fields must be valid
    if (!this.isValid()) {
      return;
    }

    // if all fields are correct, do register
    const { email, password, username } = this.state;
    this.setLoading(true);

    try {
      // register user
      await this.props.register(email, password, username);
      // if registration is successful
      this.mounted && this.setState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        registrationSuccess: true
      });

    } catch (err) {
      this.mounted && this.setError(err.message);
    } finally {
      this.mounted && this.setLoading(false);
    }
  }

  // RENDER
  render() {
    // if registration is successful,
    // show notification
    const { registrationSuccess } = this.state;
    if (registrationSuccess) {
      return <NotiticationWithTransfer
        header="Пользователь создан"
        text="Регистрация прошла успешно."
        path="/"
        pathText="Главная"
      />;
    }

    // get data from state
    const { loading, error, touched,
      email, emailValidations,
      username, usernameValidations,
      password, passwordValidations
    } = this.state;
    

    return (
      <Card>
        
        {/* CONTENT */}
        <CardContent>
          {/* Email */}
          <TextInput
            id='email'
            label='Email'
            value={email}
            type='email'
            touched={touched}
            validate={true}
            validations={emailValidations}
            onChange={this.onChangeEmailHandler}
            onPressEnter={this.onPressEnterEmailHandler}
          />
          {/* Username */}
          <TextInput
            id='Username'
            label='Email'
            value={username}
            type='text'
            touched={touched}
            validate={true}
            validations={usernameValidations}
            onChange={this.onChangeUsernameHandler}
            onPressEnter={this.onPressEnterUsernameHandler}
          />
          {/* Password */}
          <TextInput
            id='password'
            label='Password'
            value={password}
            type='password'
            touched={touched}
            validate={true}
            validations={passwordValidations}
            onChange={this.onChangePasswordHandler}
            onPressEnter={this.onPressEnterPasswordHandler}
          />
          {/* Confirm Password */}
          <Input
            id="confirm"
            type="password"
            label="Confirm password"
            value={this.state.confirmPassword}
            onChange={this.onChangeConfirmPasswordHandler}
          />
        </CardContent>

        {/* ACTIONS */}
        <CardActions>
          <Button
            text="Регистрация"
            disabled={loading}
            onClick={this.onClickSubmitHandler}
          />
        </CardActions>
        
        {/* ERROR */}
        <CardErrors>
          { error }
        </CardErrors>

      </Card>
    );
  }
}


export default connector(
  withRouter(
    RegisterComponent
  )
);

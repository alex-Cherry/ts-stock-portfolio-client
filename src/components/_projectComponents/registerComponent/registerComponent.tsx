import React from 'react';
import { AnyAction } from 'redux';
import { connect, ConnectedProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { withRouter, RouteComponentProps } from 'react-router-dom';
// custom components
import Card, { CardContent, CardActions, CardErrors } from '../../card';
import { Input } from '../../inputs';
import Button from '../../button';
import TextInput from '../textInput';
import NotiticationWithTransfer from '../notiticationWithTransfer';
// actions
import { register } from '../../../store/auth/action';
// input checker
import { email, required, minLength } from '../../../utils/inputChecker/validators';
import { ValidationsRuleType } from '../../../utils/inputChecker/validate';
// CSS
import './registerComponent.scss';


// DESCRIPTION:
// 
// This component allows to register in the system.
// 
// The component is complex, consists of several simple elements: TextInput, Button.
//  The custom react component "Card" is used for organization of child components.
// 
// Before register we must check that fields:
// - email
// - password
// - username
// are completed and valid.
// Otherwise, a warning is issued.
// 
// If registration was successful, a component "NotificationWithTransfer" is displayed,
//  what leads to the main page.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// MAP DISPATCH
const mapDispatch = (dispatch: ThunkDispatch<void, unknown, AnyAction>) => {
  return {
    register: (email: string, password: string, username: string): Promise<void> => dispatch(register(email, password, username))
  }
}

// PROPS
const connector = connect(null, mapDispatch);
type RegisterComponentProps = ConnectedProps<typeof connector>
  & RouteComponentProps;

// STATE
type RegisterComponentState = {
  // The flag indicates that an async operation is executing
  loading: boolean,
  // Stores an error messsage got after a request to a server
  error: string,

  // The next states are fields necessary for login:
  email: string,
  password: string,
  username: string,
  confirmPassword: string,

  // Whether the "email" is valid
  isEmailValid: boolean,
  // Whether the "password" is valid
  isPasswordValid: boolean,
  // Whether the "username" is valid
  isUsernameValid: boolean,
  
  // This flag indicates a registration is completed successfully
  registrationSuccess: boolean,
  // The flag indicates that all fields must be validated
  //  regardless whether they is changed or not
  forceValidation: boolean
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class RegisterComponent extends React.Component<RegisterComponentProps, RegisterComponentState> {

  // ===< CLASS FIELDS >===
  // 
  // This field stores the mark that DOM is rendered.
  //  An user can start async operations and don't wait until they finished.
  //  In that case leak memories have place.
  // 
  // So we use this field in async operations to not interact with the component,
  //  when DOM is already (or yet) not rendered
  private mounted: boolean = false;
  // These rules are used for check of the state "email"
  private emailValidations: ValidationsRuleType = {
    required: { rule: required, msg: `Поле 'Email' не заполнено.` },
    email: { rule: email, msg: `Поле 'Email' не корректно.` }
  };
  // These rules are used for check of the state "username"
  private usernameValidations: ValidationsRuleType = {
    required: { rule: required, msg: `Поле 'Username' не заполнено.` }
  };
  // These rules are used for check of the state "password"
  private passwordValidations: ValidationsRuleType = {
    required: { rule: required, msg: `Поле 'Password' не заполнено.` },
    minLength: { rule: minLength(6), msg: `Поле 'Password' долно содержать не менее 6 символов.` }
  };


  // ===< STATE >===
  // 
  state: RegisterComponentState = {
    // email
    email: '',
    isEmailValid: false,
    // username
    username: '',
    isUsernameValid: false,
    // password
    password: '',
    isPasswordValid: false,
    // others
    confirmPassword: '',
    registrationSuccess: false,
    forceValidation: false,
    loading: false,
    error: ''
  }


  // ===< LIFECYCLE >===
  // 
  /**
   * componentDidMount
   */
  componentDidMount = () => {
    this.setLoading(false);
    this.setError('');
    this.mounted = true;
  }
  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    this.mounted = false;
  }


  // ===< EVENT HANDLERS >===
  // 
  // => Email - "onChange"
  onChangeEmailHandler = (data: string, valid: boolean) => {
    this.setState({
      email: data.trim(),
      isEmailValid: valid
    });
  }
  // => Email - "onPressEnter"
  onPressEnterEmailHandler = () => {
    this.doSubmit();
  }
  // => Username - "onChange"
  onChangeUsernameHandler = (data: string, valid: boolean) => {
    this.setState({
      username: data.trim(),
      isUsernameValid: valid
    });
  }
  // => Username - "onPressEnter"
  onPressEnterUsernameHandler = () => {
    this.doSubmit();
  }
  // => Password - "onChange"
  onChangePasswordHandler = (data: string, valid: boolean) => {
    this.setState({
      password: data.trim(),
      isPasswordValid: valid
    });
  }
  // => Password - "onPressEnter"
  onPressEnterPasswordHandler = () => {
    this.doSubmit();
  }
  // => Confirm Password - "onChange"
  onChangeConfirmPasswordHandler = (data: string) => {
    this.setState({
      confirmPassword: data
    });
  }
  // => btn "Submit" - "onClick"
  onClickSubmitHandler = () => {
    this.doSubmit();
  }


  // ===< UTILS >===
  // 
  /**
   * Returns "true", if all verifiable fields are valid,
   *  "false" otherwise
   */
  isValid = (): boolean => {
    const { isEmailValid, isPasswordValid, isUsernameValid } = this.state;
    return isEmailValid && isPasswordValid && isUsernameValid;
  }
  /**
   * Returns "true", if all verifiable fields are completed,
   *  "false" otherwise
   */
  hasData = (): boolean => {
    const { email, password, username } = this.state;
    return !!email.trim() && !!password.trim() && !!username.trim();
  }
  /**
   * Sets the state "loading" to the "value"
   */
  setLoading = (value: boolean): void => {
    this.setState({
      loading: value
    });
  }
  /**
   * Sets the state "error" to the "msg"
   */
  setError = (msg: string): void => {
    this.setState({
      error: msg
    });
  }
  /**
   * Does the async operation "registration"
   */
  doSubmit = async (): Promise<void> => {
    // All fields must be completed
    if (!this.hasData()) {
      this.setState({ forceValidation: true });
      return;
    }
    // All fields must be valid
    if (!this.isValid()) {
      return;
    }

    // If all fields are correct, do register
    const { email, password, username } = this.state;
    this.setLoading(true);

    try {
      // Register user
      await this.props.register(email, password, username);
      // If registration is successful
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


  // ===< RENDER >===
  // 
  render() {
    // If registration is successful,
    //  show a notification
    const { registrationSuccess } = this.state;
    if (registrationSuccess) {
      return <NotiticationWithTransfer
        header="Пользователь создан"
        text="Регистрация прошла успешно."
        path="/"
        pathText="Главная"
      />;
    }

    // Get data from the state
    const { loading, error, forceValidation,
      email,
      username,
      password,
    } = this.state;
    

    return (
      <Card
        className="register-form"
      >

        {/* CONTENT */}
        <CardContent>
          {/* Email */}
          <TextInput
            id='email'
            label='Email'
            value={ email }
            type='email'
            forceValidation={ forceValidation }
            validate={ true }
            validations={ this.emailValidations }
            className="register-form__input"

            onChange={ this.onChangeEmailHandler }
            onPressEnter={ this.onPressEnterEmailHandler }
          />
          {/* Username */}
          <TextInput
            id='Username'
            label='Username'
            value={ username }
            type='text'
            forceValidation={ forceValidation }
            validate={ true }
            validations={ this.usernameValidations }
            className="register-form__input"

            onChange={ this.onChangeUsernameHandler }
            onPressEnter={ this.onPressEnterUsernameHandler }
          />
          {/* Password */}
          <TextInput
            id='password'
            label='Password'
            value={ password }
            type='password'
            forceValidation={ forceValidation }
            validate={ true }
            validations={ this.passwordValidations }
            className="register-form__input"

            onChange={ this.onChangePasswordHandler }
            onPressEnter={ this.onPressEnterPasswordHandler }
          />
          {/* Confirm Password */}
          <Input
            id="confirm"
            type="password"
            label="Confirm password"
            value={ this.state.confirmPassword }
            className="register-form__input"

            // onChange={ this.onChangeConfirmPasswordHandler }
          />
        </CardContent>

        {/* ACTIONS */}
        <CardActions>
          <Button
            text="Регистрация"
            disabled={ loading }

            onClick={ this.onClickSubmitHandler }
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

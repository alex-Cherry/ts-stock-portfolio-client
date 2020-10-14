import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { withRouter, RouteComponentProps } from 'react-router-dom';
// custom components
import Card, { CardContent, CardActions, CardErrors } from '../../card';
import Button from '../../button';
import TextInput from '../textInput';
import { Input } from '../../inputs';
// actions
import { login } from '../../../store/auth/action';
import { AuthLoginAction } from '../../../store/auth/types';
// input checker
import { email, required, minLength } from '../../../utils/inputChecker/validators';
import { ValidationsRuleType } from '../../../utils/inputChecker/validate';
// CSS
import './loginComponent.scss';


// DESCRIPTION:
// 
// This component allows to login to the system.
// 
// The component is complex, consists of several simple elements: TextInput, Button.
//  The custom react component "Card" is used for organization of child components.
// 
// Before login we must check that fields:
// - email
// - password
// are completed and valid.
// Otherwise, a warning is issued.
// 

////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////


// MAP DISPATCH
const mapDispatch = (dispatch: ThunkDispatch<void, unknown, AuthLoginAction>) => {
  return {
    login: (email: string, password: string): Promise<void> => dispatch(login(email, password))
  }
}

// PROPS
const connector = connect(null, mapDispatch);
type LoginComponentProps = ConnectedProps<typeof connector>
  & RouteComponentProps;

// STATE
type LoginComponentState = {
  // The flag indicates that an async operation is executing
  loading: boolean,
  // Stores an error messsage got after a request to a server
  error: string,
  // The flag indicates that all fields must be validated
  //  regardless whether they is changed or not
  forceValidation: boolean,
  // The next states are fields necessary for login:
  email: string,
  password: string,
  // Whether the state "email" is valid
  isEmailValid: boolean,
  // Whether the state "password" is valid
  isPasswordValid: boolean
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class LoginComponent extends React.Component<LoginComponentProps, LoginComponentState> {

  // ===< CLASS FIELDS >===
  // 
  // This field stores the mark that DOM is rendered.
  //  An user can start async operations and don't wait until they finished.
  //  In that case leak memories have place.
  // 
  // So we use this field in async operations to not interact with the component,
  //  when DOM is already (or yet) not rendered
  private mounted: boolean = true;
  // These rules are used for check of the state "email"
  private emailValidations: ValidationsRuleType = {
    required: { rule: required, msg: `Поле 'Email' не заполнено.` },
    email: { rule: email, msg: `Поле 'Email' не корректно.` }
  };
  // These rules are used for check of the state "password"
  private passwordValidations: ValidationsRuleType = {
    required: { rule: required, msg: `Поле 'Password' не заполнено.` },
    minLength: { rule: minLength(6), msg: `Поле 'Password' долно содержать не менее 6 символов.` }
  }


  // ===< STATE >===
  // 
  state: LoginComponentState = {
    loading: false,
    error: '',
    forceValidation: false,
    // email
    email: '',
    isEmailValid: false,
    // password
    password: '',
    isPasswordValid: false
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
  componentWillUnmount = () => {
    this.mounted = false;
  }


  // ===< EVENT HANDLERS >===
  // 
  // => Email - "onChange"
  onChangeEmailHandler = (data: string, valid: boolean) => {
    this.setState({
      email: data.trim(),
      isEmailValid: valid
    })
  }
  // => Email - "onPressEnter"
  onPressEnterEmailHandler = () => {
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
  // => btn "Submit" - "onClick"
  onClickSubmitHandler = () => {
    this.doSubmit();
  }


  // ===< UTILS >===
  // 
  /**
   * Returns "true", if all verifiable fields are completed,
   *  "false" otherwise
   */
  hasData = (): boolean => {
    const { email, password } = this.state;
    return !!email.trim() && !!password.trim();
  }
  /**
   * Sets the state "loading" to the "value"
   */
  setLoading = (value: boolean): void => {
    this.setState({ loading: value });
  }
  /**
   * Sets the state "error" to the "msg"
   */
  setError = (msg: string): void => {
    this.setState({ error: msg });
  }
  /**
   * Returns "true", if all verifiable fields are valid,
   *  "false" otherwise
   */
  isValid = (): boolean => {
    const { isEmailValid, isPasswordValid } = this.state;
    return isEmailValid && isPasswordValid;
  }
  /**
   * Does the async operation "login"
   */
  doSubmit = (): void => {
    // All fields must be completed
    if (!this.hasData()) {
      this.setState({ forceValidation: true });
      return;
    }
    // All fields must be valid
    if (!this.isValid()) {
      return;
    }
    // If all is correct, do login
    const { email, password } = this.state;
    const { login, history } = this.props;
    this.setLoading(true);
    login(email, password)
      .then(() => {
        this.mounted && history.push('/companies');
      })
      .catch(err => {
        this.mounted && this.setError(err.message);
      })
      .finally(() => {
        this.mounted && this.setLoading(false);
      });
  }


  // ===< RENDER >===
  // 
  render() {

    // Get data from the state
    const {
      loading,
      error,
      forceValidation,
      email,
      password
    } = this.state;

    return (
      <Card
        className="login-form"
      >

        {/* CONTENT */}
        <CardContent>
          {/* Email */}
          {/* <TextInput
            id='email'
            label='Email'
            value={ email }
            type='email'
            forceValidation={ forceValidation }
            validate={ true }
            validations={ this.emailValidations }
            className="login-form__input"

            onChange={ this.onChangeEmailHandler }
            onPressEnter={ this.onPressEnterEmailHandler }
          /> */}
          <Input
            label='Email'
            data={ email }
            type='email'
            forceValidation={ forceValidation }
            validate={ true }
            validations={ this.emailValidations }
            className="login-form__input"

            onChange={ this.onChangeEmailHandler }
            onPressEnter={ this.onPressEnterEmailHandler }
          />
          {/* Password */}
          {/* <TextInput
            id='password'
            label='Password'
            value={password}
            type='password'
            forceValidation={ forceValidation }
            validate={ true }
            validations={ this.passwordValidations }
            className="login-form__input"

            onChange={ this.onChangePasswordHandler }
            onPressEnter={ this.onPressEnterPasswordHandler }
          /> */}
        </CardContent>

        {/* ACTIONS */}
        <CardActions position="left">
          <Button
            text="Войти"
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
    LoginComponent
  )
);

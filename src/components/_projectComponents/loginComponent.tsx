////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { withRouter, RouteComponentProps } from 'react-router-dom';
// import custom components
import Card, { CardContent, CardActions, CardErrors } from '../card';
import Button from '../button';
import TextInput from './textInput';
// import actions
import { login } from '../../store/auth/action';
import { AuthLoginAction } from '../../store/auth/types';
// import input checker
import { email, required, minLength } from '../../utils/inputChecker/validators';
import { ValidationsRuleType } from '../../utils/inputChecker/validate';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type LoginComponentExtraProps = {}

type LoginComponentState = {
  loading: boolean,
  error: string,
  email: string,
  isEmailValid: boolean,
  password: string,
  isPasswordValid: boolean,
  touched: boolean
}

// DISPATCH
const mapDispatch = (dispatch: ThunkDispatch<void, unknown, AuthLoginAction>) => {
  return {
    login: (email: string, password: string): Promise<void> => dispatch(login(email, password))
  }
}

const connector = connect(null, mapDispatch);
type LoginComponentProps = ConnectedProps<typeof connector>
  & RouteComponentProps
  & LoginComponentExtraProps;


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////
class LoginComponent extends React.Component<LoginComponentProps, LoginComponentState> {

  private mounted: boolean = true;
  private emailValidations: ValidationsRuleType = {
    required: { rule: required, msg: `Поле 'Email' не заполнено.` },
    email: { rule: email, msg: `Поле 'Email' не корректно.` }
  };
  private passwordValidations: ValidationsRuleType = {
    required: { rule: required, msg: `Поле 'Password' не заполнено.` },
    minLength: { rule: minLength(6), msg: `Поле 'Password' долно содержать не менее 6 символов.` }
  }

  state: LoginComponentState = {
    loading: false,
    error: '',
    touched: false,
    // email
    email: '',
    isEmailValid: false,
    // password
    password: '',
    isPasswordValid: false
  }

  // LIFECYCLE
  componentDidMount = () => {
    this.setLoading(false);
    this.setError('');
    this.mounted = true;
  }
  componentWillUnmount = () => {
    this.mounted = false;
  }

  // EVENT HANDLERS
  //  => Email
  onChangeEmailHandler = (data: string, valid: boolean) => {
    this.setState({
      email: data.trim(),
      isEmailValid: valid
    })
  }
  onPressEnterEmailHandler = () => {
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
  //  => Submit
  onClickSubmitHandler = () => {
    this.doSubmit();
  }

  // UTILS
  hasData = (): boolean => {
    const { email, password } = this.state;
    return !!email.trim() && !!password.trim();
  }
  setLoading = (value: boolean): void => {
    this.setState({ loading: value });
  }
  setError = (msg: string): void => {
    this.setState({ error: msg });
  }
  isValid = (): boolean => {
    const { isEmailValid, isPasswordValid } = this.state;
    return isEmailValid && isPasswordValid;
  }
  doSubmit = (): void => {
    // // all fields must be completed
    // if (!this.hasData()) {
    //   this.setState({ touched: true });
    //   return;
    // }
    // // all fields must be valid
    // if (!this.isValid()) {
    //   return;
    // }
    // if all is correct, do login
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

  // RENDER
  render() {

    // get data from state
    const { loading, error, touched, email, password } = this.state;

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
            validations={this.emailValidations}
            onChange={this.onChangeEmailHandler}
            onPressEnter={this.onPressEnterEmailHandler}
          />
          {/* Password */}
          <TextInput
            id='password'
            label='Password'
            value={password}
            type='password'
            touched={touched}
            validate={true}
            validations={this.passwordValidations}
            onChange={this.onChangePasswordHandler}
            onPressEnter={this.onPressEnterPasswordHandler}
          />
        </CardContent>

        {/* ACTIONS */}
        <CardActions position="left">
          <Button
            text="Войти"
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
    LoginComponent
  )
);

import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';
// custom components
import MainContainer from '../../components/_projectComponents/mainContainer';
import LoginComponent from '../../components/_projectComponents/loginComponent';
import RegisterComponent from '../../components/_projectComponents/registerComponent';
import LoginSwitcher from '../../components/_projectComponents/loginSwitcher';
// types for state
import { AppState } from '../../store';
// css
import './authPage.scss';


// DESCRIPTION:
// 
// This is a page where an user can register or login in the system
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// MAP STATE
const mapState = (state: AppState) => {
  return {
    isLoggedIn: !!state.auth.token
  }
}

// PROPS
const connector = connect(mapState);
type AuthPageProps = ConnectedProps<typeof connector> & RouteComponentProps;


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const AuthPage = (props: AuthPageProps) => {

  // 
  const [ activeTab, setActiveTab ] = useState(0);


  // ===< EVENT HANDLERS >===
  // 
  /**
   * Handles a click on the "Login" button
   */
  const onClickLoginHandler = () => {
    setActiveTab(0);
  }
  /**
   * Handles a click on the "Register" button
   */
  const onClickRegisterHandler = () => {
    setActiveTab(1);
  }


  // ===< UTILS >===
  // 
  /**
   * Function renders the main content of this page
   */
  const renderMain = (): React.ReactNode => {
    // return the "Registration" form
    if (activeTab === 0) {
      return renderLogin();

    // return the "Login" form
    } else if (activeTab === 1) {
      return renderRegister();

    } 
  }
  /**
   * Renders the "Login" form
   */
  const renderLogin = () => {
    return (
      <>
        <h1>Войти</h1>
        <LoginComponent />
      </>
    );
  }
  /**
   * Renders the "Registration" form
   */
  const renderRegister = () => {
    return (
      <>
        <h1>Регистрация</h1>
        <RegisterComponent />
      </>
    );
  }


  // If an user is authorized,
  //  then redirect to the main page
  const { isLoggedIn = false } = props;
  if (isLoggedIn) {
    return <Redirect to="/" />;
  }
  

  // ===< RENDER >===
  // 
  return (
    <MainContainer>

      {/* Switcher */}
      <div className="auth-page__login-switcher">
        <LoginSwitcher
          onClickLogin={ onClickLoginHandler }
          onClickRegister={ onClickRegisterHandler }
        />
      </div>

      {/* Login / Register */}
      <div>
        { renderMain() }          
      </div>

    </MainContainer>
  );
}

export default connector(
  AuthPage
);

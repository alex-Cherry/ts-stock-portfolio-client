////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';

// import custom components
import LoginComponent from '../components/_projectComponents/loginComponent';
import RegisterComponent from '../components/_projectComponents/registerComponent';
import LoginDependantSwitcher from '../components/_projectComponents/loginDependantSwitcher';
import Tabs, { Tab } from '../components/tabs';
// import utils
import { getQueryParams } from '../utils/getQueryParams';
// import types for state
import { AppState } from '../store';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////
const mapState = (state: AppState) => {
  return {
    isLoggedIn: !!state.auth.token
  }
}

const connector = connect(mapState);
type AuthPageProps = ConnectedProps<typeof connector> & RouteComponentProps;


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////
const AuthPage: React.SFC<AuthPageProps> = (props) => {

  const renderMain = (isRegistration: boolean) => {
    // return registration form
    if (isRegistration) {
      return (
        <>
          <h1>Регистрация</h1>
          <RegisterComponent />
        </>
      );

    // return login form
    } else {
      return (
        <>
          <h1>Войти</h1>
          <LoginComponent />
        </>
      );
    }
  }

  const onClickLoginHandler = () => {
    props.history.push('/signin');
  }

  const onClickRegisterHandler = () => {
    props.history.push('/signin?register=true');
  }

  const onChangeTabsHandler = (tabNumber: number) => {
    console.log(tabNumber)
  }

  // if user is authorized,
  // then redirect to main page
  const { isLoggedIn = false } = props;
  if (isLoggedIn) {
    return <Redirect to="/" />;
  }
  // define from query whether it's register or login page
  const queryParams = getQueryParams(props.location.search);
  const isRegistration = !!queryParams.register;
  
  return (
    <div className="container1">
      <div className="row1">

        <div className="col-6 offset-3">
          <Tabs
            fullWidth={ true }
            // scrollable={ true }
            scrollStep="single"
            onChange={ onChangeTabsHandler }
          >
            {/*  */}
            <Tab
              text="Войти"
            />
            {/*  */}
            <Tab
              text="Регистрация"
            />
            
            {/* <Tab
              text="3Вкладка"
            />
            <Tab
              text="4Вкладка"
            />
            <Tab
              text="5Вкладка"
            />
            <Tab
              text="6Вкладка"
            />
            <Tab
              text="7Вкладка"
            />
            <Tab
              text="8Вкладка"
            /> */}

          </Tabs>
        </div>

        {/* Switcher */}
        <div className="col-6 offset-3">
          <LoginDependantSwitcher
            onClickLogin={onClickLoginHandler}
            onClickRegister={onClickRegisterHandler}
            isRegistration={isRegistration}
          />
        </div>

        {/* Login / Register */}
        <div className="col-6 offset-3">
          { renderMain(isRegistration) }          
        </div>

      </div>
    </div>
  );
}

export default connector(
  AuthPage
);

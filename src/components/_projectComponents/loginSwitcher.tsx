import React from 'react';
// custom components
import Tabs, { Tab } from '../tabs';
// additional libs
import classNames from 'classnames';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type LoginSwitcherProps = {
  className?: string,
  onClickLogin?:() => void,
  onClickRegister?:() => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const LoginSwitcher = (props: LoginSwitcherProps) => {

  const {
    onClickLogin = () => {},
    onClickRegister = () => {}
  } = props;


  // *** UTILS
  /**
   * defines classes, that need to apply to the root element
   */
  const getClasses = (): string => {

    const { className = '' } = props;
    // define classes with classNames lib
    const classes = classNames(
      // classes from props
      { [`${className}`]: !!className }
    );

    return classes;
  }


  // EVENT HANDLERS
  const onChangeTabHandler = (tabNumber: number) => {
    // Login
    if (tabNumber === 0) {
      onClickLogin();

    // Register
    } else if (tabNumber === 1) {
      onClickRegister();

    }
  }


  // RENDER
  return (
    <Tabs
      fullWidth={ true }
      className={ getClasses() }
      onChange={ onChangeTabHandler }
    >
      <Tab text="Войти" />
      <Tab text="Регистрация" />
    </Tabs>
  );
}

export default LoginSwitcher;

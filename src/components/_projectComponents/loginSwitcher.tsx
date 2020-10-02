import React from 'react';
// custom components
import Tabs, { Tab } from '../tabs';
// additional libs
import classNames from 'classnames';


// DESCRIPTION:
// 
// This component is a switcher between two options: "Login" and "Register".
// Depending on which button an user pressed on,
//  the appropriate event is generated.
// 
// Component "Tabs" is under hood of this component.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type LoginSwitcherProps = {
  // Extra classes, that you can apply to the root element,
  //  when you use this component inside other ones.
  // It's assumed that will be used classes that define
  //  positioning of the component
  className?: string,

  // => Events
  // It occurs when btn "Login" was clicked
  onClickLogin?:() => void,
  // It occurs when btn "Register" was clicked
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


  // ===< UTILS >===
  // 
  /**
   * Defines classes, that need to apply to the root element
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


  // ===< EVENT HANDLERS >===
  // 
  const onChangeTabHandler = (tabNumber: number) => {
    // Login
    if (tabNumber === 0) {
      onClickLogin();

    // Register
    } else if (tabNumber === 1) {
      onClickRegister();

    }
  }


  // ===< RENDER >===
  // 
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

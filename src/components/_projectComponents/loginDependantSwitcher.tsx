////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////
import React from 'react';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////
type LoginDependantSwitcherProps = {
  onClickLogin?:() => void,
  onClickRegister?:() => void,
  isRegistration?: boolean
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////
const LoginDependantSwitcher = (props: LoginDependantSwitcherProps) => {

  const {
    onClickLogin = () => {},
    onClickRegister = () => {},
    isRegistration = false
  } = props;

  const onClickLoginHanler = () => {
    onClickLogin();
  }
  const onClickRegisterHanler = () => {
    onClickRegister();
  }

  const notActiveClasses = () => {
    return 'tab col-6';
  }

  const activeClasses = () => {
    return 'tab col-6 active';
  }

  return (
    <ul className="tabs1">
      {/* Войти */}
      <li className={ isRegistration ? notActiveClasses() : activeClasses() } onClick={onClickLoginHanler}>
        Войти
      </li>
      {/* Регистрация */}
      <li className={ isRegistration ? activeClasses() : notActiveClasses() } onClick={onClickRegisterHanler}>
        Регистрация
      </li>
    </ul>
  );
}

export default LoginDependantSwitcher;

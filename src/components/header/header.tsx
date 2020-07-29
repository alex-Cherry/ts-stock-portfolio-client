import React from 'react';
// import { Link, NavLink } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
// redux store
import { AppState } from '../../store';
import { authLogout } from '../../store/auth/action';
// custom components
import Menu, { MenuItemProps } from './menu';
import Logo from './logo';
// import ProfileLogo from './profileLogo';
// css
import './header.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// state from redux
const mapState = (state: AppState) => {
  return {
    isLoggedIn: !!state.auth.user
  }
}
// actions from redux
const mapDispatch = (dispatch: any) => {
  return {
    logout: () => dispatch(authLogout())
  }
}

const connector = connect(mapState, mapDispatch);
type HeaderProps = ConnectedProps<typeof connector>;


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Header = (props: HeaderProps) => {


  // EVENT HANDLERS
  const onClickLogoutHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // logout from app
    const { logout } = props;
    logout();
  }


  // VAR-s
  // define main menu items
  const menuItems: MenuItemProps[] = [
    { text: 'Компании', path: 'companies' },
    { text: 'Брокеры', path: 'brokers' },
    { text: 'Акции', path: 'stocks' },
    { text: 'Облигации', path: 'bonds' }
  ];
  // define items for "SignIn" item
  const signInItems: MenuItemProps[] = [
    { text: 'Войти', path: 'signin' }
  ];
  // define items for "SignOut" item
  const signOutItems: MenuItemProps[] = [
    { text: 'Выйти', path: '', onClick: onClickLogoutHandler }
  ];


  // UTILS
  const renderProfile = () => {
    const { isLoggedIn } = props;

    // if user is logged in
    if (isLoggedIn) {
      return (
        <>
          {/* <ProfileLogo /> */}
          <Menu items={ signOutItems } />
        </>
      );
    }

    // if user isn't logged in
    return <Menu items={ signInItems } />;
  }


  // RENDER
  return (
    <header className="header">
      <div className="header__inner">

        {/* Header - block "Main" */}
        <div className="header__main">
          {/* Logo */}
          <Logo
            className="header__logo"
          />
          {/* Main Menu */}
          <Menu
            items={ menuItems }
            useActiveClass={ true }
            className="header__menu"
          />
        </div>

        {/* Header - block "Profile" */}
        <div className="header__profile">
          {/*  */}
          { renderProfile() }
        </div>

      </div>
    </header>
  );
}

export default connector(Header);

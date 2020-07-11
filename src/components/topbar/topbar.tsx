////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
// import redux state
import { AppState } from '../../store';
// import custom components
// import ProfileLogo from './profileLogo';
// 
import { authLogout } from '../../store/auth/action';
// import css
import './topbar.scss';

////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

const mapState = (state: AppState) => {
  return {
    isLoggedIn: !!state.auth.user
  }
}

const mapDispatch = (dispatch: any) => {
  return {
    logout: () => dispatch(authLogout())
  }
}

const connector = connect(mapState, mapDispatch);
type TopbarProps = ConnectedProps<typeof connector>;


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Topbar = (props: TopbarProps) => {
  
  const { isLoggedIn } = props;

  // EVENT HANDLERS
  const onClickLogoutHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    // logout from app
    const { logout } = props;
    logout();
  }

  return (
    <header className="header">
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <Link className="header__logo-text mx-1" to="/">Stock Portfolio</Link>
          {/* Main Menu */}
          <ul className="main-menu d-flex">
            <li className="main-menu__item">
              <NavLink className="main-menu__link" to="/companies">Компании</NavLink>
            </li>
            <li className="main-menu__item">
              <NavLink className="main-menu__link" to="/brokers">Брокеры</NavLink>
            </li>
            <li className="main-menu__item">
              <NavLink className="main-menu__link" to="/stocks">Акции</NavLink>
            </li>
            <li className="main-menu__item">
              <NavLink className="main-menu__link" to="/bonds">Облигации</NavLink>
            </li>
          </ul>

        </div>
        <div className="mr-2">
          {/* if user isn't logged */}
          {!isLoggedIn && (
            <ul className="main-menu d-flex">
              <li><Link className="main-menu__link" to="/signin">Войти</Link></li>
            </ul>
          )}
          {/* if user is logged */}
          {isLoggedIn && (
            <>
              {/* <ProfileLogo /> */}
              <ul className="main-menu d-flex">
                <li><a className="main-menu__link" href="/" onClick={onClickLogoutHandler}>Выйти</a></li>
              </ul>
            </>
          )
          }
        </div>
      </div>
    </header>
  );
}

export default connector(Topbar);

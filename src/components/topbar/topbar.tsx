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
import ProfileLogo from './profileLogo';
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
    <header>
      <div className="d-flex justify-content-between">
        <div className="d-flex">
          <Link className="brand-logo mx-1" to="/">Stock Portfolio</Link>
          <ul className="d-flex">
            <li><NavLink to="/companies">Компании</NavLink></li>
            <li><NavLink to="/brokers">Брокеры</NavLink></li>
            <li><NavLink to="/stocks">Акции</NavLink></li>
            <li><NavLink to="/bonds">Облигации</NavLink></li>
          </ul>
        </div>
        <div className="mr-2">
          {/* if user isn't logged */}
          {!isLoggedIn && (
            <ul className="d-flex">
              <li><Link to="/signin">Войти</Link></li>
            </ul>
          )}
          {/* if user is logged */}
          {isLoggedIn && (
            <>
              {/* <ProfileLogo /> */}
              <ul className="d-flex">
                <li><a href="/" onClick={onClickLogoutHandler}>Выйти</a></li>
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

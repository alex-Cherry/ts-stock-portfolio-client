////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';
// 
import { getAuthToken, getAuthUser } from '../../utils/localStorage/auth';
import { authSuccess } from '../../store/auth/action';
import { AuthLoginAction } from '../../store/auth/types';
import { User } from '../../types';

////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type CurrentUserCheckerExtraProps = {
  children?: React.ReactNode
}

const mapDispatch = (dispatch: Dispatch<AuthLoginAction>) => {
  return {
    authSuccess: (user: User, token: string) => { dispatch(authSuccess(user, token)) }
  }
}

const connector = connect(null, mapDispatch);
type CurrentUserCheckerProps = ConnectedProps<typeof connector>
  & CurrentUserCheckerExtraProps;


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////
const CurrentUserChecker = (props: CurrentUserCheckerProps) => {

  const user: User | null = getAuthUser();
  const token: string = getAuthToken();

  if (user && token) {
    props.authSuccess(user, token);
  }

  return (
    <>
      {props.children}
    </>
  );
}

export default connector(CurrentUserChecker);

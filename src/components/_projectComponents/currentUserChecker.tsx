import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
// utils
import { getAuthToken, getAuthUser } from '../../utils/localStorage/auth';
// store
import { authSuccess } from '../../store/auth/action';
// project types
import { User } from '../../types';


// DESCRIPTION:
// 
// This component checks the local storage
//  and detect the fields "user" and "token".
// If they are, the component does authentication.
// 
// This component is just a wrapper. It wraps child components
//  and those "understand" whether an user is authenticated or not.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// => MAP DISPATCH
const mapDispatch = (dispatch: any) => {
  return {
    authSuccess: (user: User, token: string) => { dispatch(authSuccess(user, token)) }
  }
}

// PROPS
const connector = connect(null, mapDispatch);
type CurrentUserCheckerProps = ConnectedProps<typeof connector>
  & {
    children: React.ReactNode
  };


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const CurrentUserChecker = (props: CurrentUserCheckerProps) => {

  // Get the user and the token from the localStorage
  const user: User | null = getAuthUser();
  const token: string = getAuthToken();
  // If there are the user and the token,
  //  do authentication
  if (user && token) {
    props.authSuccess(user, token);
  }

  
  // ===< RENDER >===
  // 
  return (
    <>
      { props.children }
    </>
  );
}

export default connector(CurrentUserChecker);

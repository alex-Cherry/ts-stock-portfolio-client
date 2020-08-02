////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { AppState } from '../store'
import { Redirect, RouteComponentProps } from 'react-router-dom';
// import custom components
import MainContainer from '../components/mainContainer';
import StockEditorComponent from '../components/_projectComponents/stockEditorComponent';
import ErrorIndicator from '../components/errorIndicator';
// import utils
import { getQueryParams } from '../utils/getQueryParams';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// MAP STATE
const mapState = (state: AppState) => {
  return {
    isAdmin: !!state.auth.user?.isAdmin
  }
}

// type Props
type EditStockPageExtraProps = {}

const connector = connect(mapState);
type EditStockPageProps = ConnectedProps<typeof connector>
  & EditStockPageExtraProps
  & RouteComponentProps;

// type State
type EditStockPageState = {
  hasError: boolean
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class EditStockPage extends React.Component<EditStockPageProps, EditStockPageState> {

  state = {
    hasError: false
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  // LIFECYCLE HOOKS
  componentDidCatch = () => {}
  
  // UTILS
  getId = (): string => {
    // get id from query params
    const { location } = this.props;
    const params = getQueryParams(location.search);
    return ("id" in params) ? params.id : '';
  }
  headerText = (): string => {
    // form headerText
    const headerText: string = this.getId() ? 'Редактировать акцию' : 'Добавить акцию';
    return headerText;
  }

  // RENDER
  render() {

    const { isAdmin } = this.props;
    const { hasError } = this.state;
    
    // this page is allowed for users with admin role
    if (!isAdmin) {
      return <Redirect to="/" />;
    }

    // component has an error
    if (hasError) {
      return <ErrorIndicator />;
    }
    
    // Main content
    return (
      <MainContainer>
        <h1>{ this.headerText() }</h1>
        <StockEditorComponent />
      </MainContainer>
    );
  }
}

export default connector(EditStockPage);

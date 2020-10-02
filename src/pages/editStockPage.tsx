import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { AppState } from '../store'
import { Redirect, RouteComponentProps } from 'react-router-dom';
// custom components
import MainContainer from '../components/_projectComponents/mainContainer';
import StockEditorComponent from '../components/_projectComponents/stockEditorComponent';
import ErrorIndicator from '../components/errorIndicator';
// utils
import { getQueryParams } from '../utils/getQueryParams';


// DESCRIPTION:
// 
// This is a page where an user can add a new stock or edit an existing one.
// 


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

// PROPS
const connector = connect(mapState);
type EditStockPageProps = ConnectedProps<typeof connector>
  & RouteComponentProps;

// STATE
type EditStockPageState = {
  // flag, if there is an error while the page opening
  // hasError: boolean
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class EditStockPage extends React.Component<EditStockPageProps, EditStockPageState> {
  
  // ===< UTILS >===
  // 
  /**
   * func returns the value of the param "id".
   * If it's not set, func returns an empty string
   */
  getId = (): string => {
    // get param "id" from query params
    const { location } = this.props;
    const params = getQueryParams(location.search);
    return ("id" in params) ? params.id : '';
  }
  /**
   * Func returns the string, containing the page header
   */
  headerText = (): string => {
    // Form the headerText
    const headerText: string = this.getId() ? 'Редактировать акцию' : 'Добавить акцию';
    return headerText;
  }


  // ===< RENDER >===
  // 
  render() {

    const { isAdmin } = this.props;
    
    // This page is only available for users with admin role
    if (!isAdmin) {
      return <Redirect to="/" />;
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

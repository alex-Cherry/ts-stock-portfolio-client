import React from 'react';
// custom elements
import ErrorIndicator from '../errorIndicator';


// DESCRIPTION:
// 
// This component catches errors in its child components
//  and displays fallback UI.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type ErrorBoundaryProps = {
  children: React.ReactNode
}
type ErrorBoundaryState = {
  hasError: boolean
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

  // ===< STATE >===
  // 
  state = {
    hasError: false
  }


  // Special method for ErrorBondary
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }


  // ===< RENDER >===
  // 
  render() {
    // In the case of an error,
    //  return a component "ErrorIndicator"
    if (this.state.hasError) {
      return <ErrorIndicator />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

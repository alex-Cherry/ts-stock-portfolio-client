import React from 'react';
// import custom elements
import ErrorIndicator from './errorIndicator';


type ErrorBoundaryProps = {
  children: React.ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {

  state = {
    hasError: false
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true });
  }

  render() {

    if (this.state.hasError) {
      return <ErrorIndicator />;
    }

    return this.props.children;
    //   <>
    //     {this.props.children}
    //   </>
    // );
  }
}

export default ErrorBoundary;

import React from 'react';
// css
import './errorIndicator.scss';
// png
import errorImg from '../../assets/images/error.png';


// DESCRIPTION:
// 
// This component allows to show an user that an error has occured.
// It's also a fallback UI for the component "ErrorBoundary".
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type ErrorIndicatorProps = {
  // An error's text
  text?: string
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const ErrorIndicator = (props: ErrorIndicatorProps) => {

  // ===< UTILS >===
  // 
  /**
   * Func returns the error description
   */
  const getContent = () => {
    const { text } = props;

    if (text) {
      // If the text is defined in the props, return one
      return (
        <div className="error-indicator__text">
          { text }
        </div>
      );

    } else {
      // Otherwise, return the default text
      return (
        <div className="error-indicator__text">
          Что-то совершенно пошло не так!
          <br />
          (но мы уже занялись этой проблемой)
        </div>
      );

    }
  }


  // ===< RENDER >===
  // 
  return (
    <div className="error-indicator">
      {/* img */}
      <img className="error-indicator__img" src={errorImg} alt="" />
      {/* header */}
      <span className="error-indicator__header">BOOM!</span>
      {/* text */}
      { getContent() }
    </div>
  );
}

export default ErrorIndicator;

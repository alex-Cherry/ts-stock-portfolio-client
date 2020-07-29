import React from 'react';
// css
import './errorIndicator.scss';
// png
import errorImg from '../../assets/images/error.png';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type ErrorIndicatorProps = {
  // string that defines the text of the error
  text?: string
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const ErrorIndicator = (props: ErrorIndicatorProps) => {

  // UTILS
  /**
   * func returns the description of the error
   */
  const getContent = () => {
    const { text } = props;

    if (text) {
      // if the text is defined in props, return one
      return (
        <div className="error-indicator__text">
          { text }
        </div>
      );

    } else {
      // otherwise, return a default text
      return (
        <div className="error-indicator__text">
          Что-то совершенно пошло не так!
          <br />
          (но мы уже занялись этой проблемой)
        </div>
      );

    }
  }


  // RENDER
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

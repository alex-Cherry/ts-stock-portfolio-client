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
      return (<span>{ text }</span>);

    } else {
      // otherwise, return a default text
      return (
        <>
          <span>Что-то совершенно пошло не так!</span>
          <span>(но мы уже занялись этой проблемой)</span>
        </>
      );

    }
  }


  // RENDER
  return (
    <div className="error-indicator error-indicator_theme_base">
      {/* img */}
      <img className="error-indicator__img" src={errorImg} alt="" />
      {/* header */}
      <span className="error-indicator__header error-indicator_size_base">BOOM!</span>
      {/* text */}
      { getContent() }
    </div>
  );
}

export default ErrorIndicator;

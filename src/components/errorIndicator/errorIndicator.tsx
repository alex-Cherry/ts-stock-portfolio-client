import React from 'react';
import './errorIndicator.scss';
import errorImg from '../../assets/images/error.png';

type ErrorIndicatorProps = {
  text?: string
}

const ErrorIndicator = (props: ErrorIndicatorProps) => {

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

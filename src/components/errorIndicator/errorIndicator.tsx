import React from 'react';
import './errorIndicator.scss';
import errorImg from '../../assets/images/error.png';

type ErrorIndicatorProps = {
  text?: string
}

const ErrorIndicator = (props: ErrorIndicatorProps) => {

  const { text } = props;

  return (
    <div className="error-indicator">
      <img src={errorImg} alt="" />
      <span className="boom">BOOM!</span>
      {/* if text isn't defined */}
      {
        !text &&
          <>
            <span>Что-то совершенно пошло не так!</span>
            <span>(но мы уже занялись этой проблемой)</span>
          </>
      }
      {
        text && <span>{text}</span>
      }
    </div>
  );
}

export default ErrorIndicator;

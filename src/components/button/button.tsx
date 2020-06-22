import React from 'react';
// import css
import './button.scss';

type ButtonProps = {
  text: string,
  className?: string,
  disabled?: boolean,
  onClick?: () => void
}

const Button = (props: ButtonProps) => {

  const { text, className = '', disabled = false, onClick = () => {} } = props;
  const classNames = [ className, "btn1", disabled ? "disabled" : "" ];

  return (
    <button
      className={classNames.join(' ')}
      disabled={disabled}
      onClick={onClick}
    >
      <div className="d-flex">
        {text}
        <i className="material-icons">send</i>
      </div>
    </button>
  );
}

export default Button;

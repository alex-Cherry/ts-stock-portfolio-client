////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////
import React, { MouseEvent } from 'react';
import { Link } from 'react-router-dom';

// import css
import './floatingButton.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////
type FloatingButtonProps = {
  buttonType: string,
  onClick?: () => void,
  isFixed?: boolean
}

////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////
const FloatingButton = (props: FloatingButtonProps) => {

  const { buttonType = '', onClick = () => {}, isFixed = false } = props;

  // EVENT HANDLERS
  const clickHandler = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onClick();
  }

  // RENDER
  // button element
  const btn = (
    <Link className='btn-floating1' to="/" onClick={clickHandler} >
      <i className="material-icons">{buttonType}</i>
    </Link>
  );

  // define whether put button in the left-down corner or not
  let element = btn;
  if (isFixed) {
    element = (
      <div className="fixed-action-btn">
        {btn}
      </div>
    );
  }

  return element;
}

export default FloatingButton;

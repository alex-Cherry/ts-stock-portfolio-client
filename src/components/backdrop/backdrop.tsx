import React from 'react';
// import css
import './backdrop.scss';

type BackdropProps = {
  onClick?: () => void
}

const Backdrop = (props: BackdropProps) => {

  const {
    onClick = () => {}
  } = props;

  return (
    <div
      className='backdrop'
      onClick={onClick}
    >
    </div>
  );
}

export default Backdrop;

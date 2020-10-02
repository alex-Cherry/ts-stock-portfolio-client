import React from 'react';
// css
import './backdrop.scss';


// DESCRIPTION:
// 
// This component is used together with modal components.
// It's necessary to understand when an event "Click" happened not on a modal component.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type BackdropProps = {
  // => Events
  // A click on a backdrop
  onClick?: () => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Backdrop = (props: BackdropProps) => {

  const {
    onClick = () => {}
  } = props;


  // ===< RENDER >===
  // 
  return (
    <div
      className='backdrop'
      onClick={ onClick }
    >
    </div>
  );
}

export default Backdrop;

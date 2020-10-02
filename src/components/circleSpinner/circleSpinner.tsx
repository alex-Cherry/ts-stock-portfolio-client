import React from 'react';
// css
import './circleSpinner.scss';


// DESCRIPTION:
// 
// This component is an animation block. It's a rotating circle.
// It is used as a loader that indicates that an operation is executing.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const CircleSpinner = () => {

  // ===< RENDER >===
  // 
  return (
    <div className="circle-spinner"></div>
  );
}

export default CircleSpinner;

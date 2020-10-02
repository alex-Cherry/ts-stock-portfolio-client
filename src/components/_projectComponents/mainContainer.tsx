import React from 'react';


// DESCRIPTION:
// 
// This component defines the specialized container (CSS-marking) for its child components.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type MainContainerProps = {
  children: React.ReactNode
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const MainContainer = (props: MainContainerProps) => {

  // ===< RENDER >===
  // 
  return (
    <div className="container">
      <div className="row">
        <div className="col-6 offset-3">
          { props.children }
        </div>
      </div>
    </div>
  );
}

export default MainContainer;

import React from 'react';

type MainContainerProps = {
  children: React.ReactNode
}

const MainContainer = (props: MainContainerProps) => {
  return (
    <div className="container1">
      <div className="row1">
        <div className="col-6 offset-3">
          { props.children }
        </div>
      </div>
    </div>
  );
}

export default MainContainer;

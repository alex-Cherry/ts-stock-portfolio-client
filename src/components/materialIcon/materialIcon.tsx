import React from 'react';

type MaterialIconProps = {
  iconName: string,
  onClick?: () => void
}

const MaterialIcon = (props: MaterialIconProps) => {
  // 
  const { iconName, onClick = () => {} } = props;

  const onClickHandler = () => {
    onClick();
  }

  return (
    <i
      // ref={item.ref}
      className="material-icons"
      onClick={onClickHandler}
    >
      { iconName }
    </i>
  )
}

export default MaterialIcon;

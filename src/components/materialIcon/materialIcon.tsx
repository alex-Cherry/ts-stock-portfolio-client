import React from 'react';

type MaterialIconProps = {
  iconName: string,
  className?: string,
  onClick?: () => void
}

const MaterialIcon = (props: MaterialIconProps) => {
  // 
  const { iconName, onClick = () => {} } = props;

  const onClickHandler = () => {
    onClick();
  }

  const getClasses = () => {
    const { className } = props;
    const classes = ['material-icons'];
    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  }

  return (
    <i
      className={getClasses()}
      onClick={onClickHandler}
    >
      { iconName }
    </i>
  )
}

export default MaterialIcon;

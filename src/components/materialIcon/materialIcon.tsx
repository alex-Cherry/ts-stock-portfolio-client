import React from 'react';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type MaterialIconProps = {
  // material icon's name
  iconName: string,
  // extra classes, that you can apply to the root element,
  // when you use this component inside other ones.
  // It's assumed that will be used classes that define
  // positioning of the component
  className?: string,
  // handler for event "onClick"
  onClick?: () => void
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const MaterialIcon = (props: MaterialIconProps) => {
  // 
  const {
    iconName,
    onClick = () => {}
  } = props;


  // EVENT HANDLERS
  const onClickHandler = () => {
    onClick();
  }


  // UTILS
  /**
   * defines classes, that need to apply to the root element
   */
  const getClasses = () => {
    // destructure props
    const { className } = props;
    // define default classes
    const classes = ['material-icons'];
    // extra classes
    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  }


  // RENDER
  return (
    <i
      className={ getClasses() }
      onClick={ onClickHandler }
    >
      { iconName }
    </i>
  )
}

export default MaterialIcon;

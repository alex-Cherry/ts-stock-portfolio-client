import React from 'react';
// third-party libs
import classNames from 'classnames';


// DESCRIPTION:
// 
// This component is used to display an icon from material icon collection (https://material.io).
//  The icon name is defined in the property "iconName".
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type MaterialIconProps = {
  // A material icon's name
  iconName: string,
  // Extra classes, that you can apply to the root element,
  //  when you use this component inside other ones.
  // It's assumed that will be used classes that define
  //  positioning of the component
  className?: string,

  // => Events
  // A click on the icon
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


  // ===< EVENT HANDLERS >===
  // 
  const onClickHandler = () => {
    onClick();
  }


  // ===< UTILS >===
  // 
  /**
   * Defines classes to apply to the root element
   */
  const getClasses = () => {
    // destructure props
    const { className } = props;

    const classes = classNames(
      // default classes
      'material-icons',
      // extra classes
      { [`${className}`]: !!className }
    );

    return classes;
  }


  // ===< RENDER >===
  // 
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

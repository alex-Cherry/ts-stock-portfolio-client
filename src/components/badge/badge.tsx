import React from 'react';
// third-party libs
import classNames from 'classnames';
// css
import './badge.scss';


// DESCRIPTION:
// 
// This component is just a badge that can display any notifications.
// It's used to highlight any text.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type BadgeProps = {
  // A text of the badge
  text: string,
  // Extra classes, that you can apply to the root element,
  //  when you use this component inside other ones.
  // It's assumed that will be used classes that define
  //  positioning of the component
  className?: string,
  // If the flag = "true", special class will be applied to the component.
  //  The component will be highlighted as active
  active?: boolean,

  // => Events
  // A click on the badge
  onClick?: () => void
};


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Badge = (props: BadgeProps) => {

  // Desctructure the props
  const {
    text,
    onClick = () => {}
  } = props;


  // ===< UTILS >===
  // 
  /**
   * Defines classes to apply to the root element
   */
  const getClasses = (): string => {

    const {
      active = false,
      className = ''
    } = props;

    const classes = classNames(
      // Default classes
      'badge',
      // If the element is active, add the spec class
      { 'badge--active': active },
      // Classes from the props
      { [`${className}`]: !!className }
    );

    return classes;
  }
  
  
  // ===< RENDER >===
  // 
  return (
    <span
      className={ getClasses() }
      onClick={ onClick }
    >
      { text }
    </span>
  );

}

export default Badge;

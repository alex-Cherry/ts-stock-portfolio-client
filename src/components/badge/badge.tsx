import React from 'react';
// css
import './badge.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type BadgeProps = {
  // text of the notification
  text: string,
  // extra classes, that you can apply to the root element,
  // when you use this component inside other ones.
  // It's assumed that will be used classes that define
  // positioning of the component
  className?: string,
  // mark, that special class will be applied
  active?: boolean,
  // 
  onClick?: () => void
};


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Badge = (props: BadgeProps) => {

  // desctructure props
  const {
    text,
    onClick = () => {}
  } = props;


  // UTILS
  /**
   * defines classes, that need to apply to the root element
   */
  const getClasses = (): string => {

    const {
      active = false,
      className = ''
    } = props;

    // define default classes
    const classes = ['badge'];

    // define the color scheme for the element, if it's active
    if (active) {
      classes.push('badge--active');
    }

    // extra classes
    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  }
  
  
  // RENDER
  return (
    <span
      className={getClasses()}
      onClick={onClick}
    >
      { text }
    </span>
  );

}

export default Badge;

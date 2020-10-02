import React from 'react';
// third-party libs
import classNames from 'classnames';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type CardActionsProps = {
  // Content of the element
  children: React.ReactNode,
  // Define, where display the content of the element.
  // By defualt, "left"
  position?: 'left' | 'center' | 'right'
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const CardActions = (props: CardActionsProps) => {

  const { children } = props;

  // ===< UTILS >===
  // 
  /**
   * Defines classes to apply to the sub-root element
   */
  const getClassesForContent = () => {

    const { position = 'left' } = props;

    const classes = classNames(
      // class "w-content" = width: fit-content
      'w-content',
      // define the position of the content
      { 'ml-auto': position === 'right' },
      { 'mr-auto': position === 'left' },
      { 'mx-auto': position === 'center' }
    );

    return classes;
  }


  // ===< RENDER >===
  // 
  return (
    <div className="card__actions">
      <div className={ getClassesForContent() }>
        { children }
      </div>
    </div>
  );
}

export default CardActions;

import React from 'react';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type CardActionsProps = {
  // content of the element
  children: React.ReactNode,
  // define, where display the content of the element.
  // by defualt, "left"
  position?: 'left' | 'center' | 'right'
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const CardActions = (props: CardActionsProps) => {

  const { children } = props;

  /**
   * defines classes, that need to apply to the sub-root element
   */
  const getClassesForContent = () => {

    const { position = 'left' } = props;

    // class "w-content" = width: fit-content
    const classes = ['w-content'];
    // define the position of the content
    if (position === 'left') {
      classes.push('ml-auto');
    } else if (position === 'right') {
      classes.push('mr-auto');
    } else {
      classes.push('mx-auto');
    }

    return classes.join(' ');
  }


  // RENDER
  return (
    <div className="card__actions">
      <div className={ getClassesForContent() }>
        { children }
      </div>
    </div>
  );
}

export default CardActions;

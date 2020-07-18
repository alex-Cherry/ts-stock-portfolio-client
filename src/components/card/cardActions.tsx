import React from 'react';

type CardActionsProps = {
  children: React.ReactNode,
  position?: 'left' | 'center' | 'right'
}

const CardActions = (props: CardActionsProps) => {

  const { children } = props;

  const getClassesForContent = () => {

    const { position = 'left' } = props;

    const classes = ['w-content'];
    if (position === 'left') {
      classes.push('ml-auto');
    } else if (position === 'right') {
      classes.push('mr-auto');
    } else {
      classes.push('mx-auto');
    }

    return classes.join(' ');
  }

  return (
    <div className="card__actions">
      <div className={ getClassesForContent() }>
        { children }
      </div>
    </div>
  );
}

export default CardActions;

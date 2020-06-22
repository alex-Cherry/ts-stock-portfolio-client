import React from 'react';
// import css
import './badge.scss';

type BadgeProps = {
  text: string
  className?: string,
  onClick?: () => void
};

const Badge = (props: BadgeProps) => {

  const {
    text,
    className = '',
    onClick = () => {}
  } = props;

  const classes = ['badge'];
  if (className) {
    classes.push(className);
  }

  return (
    <span
      className={classes.join(' ')}
      onClick={onClick}
    >
      { text }
    </span>
  );
}

export default Badge;

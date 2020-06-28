import React from 'react';
// import css
import './badge.scss';

type BadgeProps = {
  text: string
  active?: boolean,
  onClick?: () => void
};

const Badge = (props: BadgeProps) => {

  const {
    text,
    active = false,
    onClick = () => {}
  } = props;

  const classes = ['badge'];
  if (active) {
    classes.push('active');
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

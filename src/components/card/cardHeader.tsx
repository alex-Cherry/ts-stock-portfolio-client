import React from 'react';

type CardHeaderProps = {
  children: string
}

const CardHeader = (props: CardHeaderProps) => {

  const { children: headerText } = props;

  if (!headerText) {
    return null;
  }

  return (
    <h3 className="card__header">
      { headerText }
    </h3>
  );
}

export default CardHeader;

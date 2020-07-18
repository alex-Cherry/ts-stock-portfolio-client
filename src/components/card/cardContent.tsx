import React from 'react';

type CardContentProps = {
  children: React.ReactNode
}

const CardContent = ({ children }: CardContentProps) => {
  return (
    <div className="card__content">
      { children }
    </div>
  );
}

export default CardContent;

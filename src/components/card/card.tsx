import React from 'react';
// import css
import './card.scss';

type CardProps = {
  children: React.ReactNode,
  actionContent?: React.ReactNode,
  error?: string
}

const Card = (props: CardProps) => {

  const { children, actionContent = null, error = '' } = props;
  
  const getErrorContent = (error: string) => {
    let errorContent = null;
    if (error) {
      const data: string[] = error.split(';');
      errorContent = getErrorContentArray(data);
    }
    return errorContent;
  }

  const getErrorContentArray = (errors: string[]) => {
    const errorContent = (
      <div className="card1-action">
        <ul>
          {
            errors
              .filter(item => !!item)
              .map((item, index) => (<li key={index} className="color-invalid">{item}</li>))
          }
        </ul>
      </div>
    );

    return errorContent;
  }

  return (
    <div className="card1">
      {/* Content */}
      <div className="card1-content">
        { children }
      </div>
      {/* Action */}
      {actionContent && (
        <div className="card1-action">
          { actionContent }
        </div>
      )}
      {/* Error */}
      { getErrorContent(error) }
    </div>
  );
}

export default Card;

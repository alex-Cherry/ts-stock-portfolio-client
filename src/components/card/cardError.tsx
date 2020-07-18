import React from 'react';

type CardErrorsProps = {
  children: string
}

const CardErrors = (props: CardErrorsProps) => {

  const renderErrors = () => {

    const errors = props.children;

    if (!errors) {
      return null;
    }

    const data: string[] = errors.split(';');

    return (
      <div className="card__actions card_error">
        <ul>
          {
            data
              .filter(item => !!item)
              .map((item, index) => (<li key={index}>{item}</li>))
          }
        </ul>
      </div>
    );
  }

  return renderErrors();
}

export default CardErrors;

import React from 'react';
// css
import './card.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type CardProps = {
  children: React.ReactNode,
  headerText?: string,
  className?: string,
  actionContent?: React.ReactNode,
  actionContentPosition?: 'left' | 'right' | 'center',
  error?: string
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Card = (props: CardProps) => {

  const { children, actionContent = null, error = '' } = props;
  
  const getClasses = (): string => {
    const classes = [
      'card',
      'card_shadow',
      'card_border_base'
    ];
    return classes.join(' ');
  }

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
      <div className="card__action">
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

  const getHeader = () => {
    const { headerText = '' } = props;
    if (!headerText) {
      return null;
    }

    return (
      <h3 className="card__header">
        { headerText }
      </h3>
    );
  }


  // RENDER
  return (
    <div className={ getClasses() }>
      {/* Header */}
      { getHeader() }
      {/* Content */}
      <div className="card__content">
        { children }
      </div>
      {/* Action */}
      {actionContent && (
        <div className="card__action">
          <div className="ml-auto">
            { actionContent }
          </div>
        </div>
      )}
      {/* Error */}
      { getErrorContent(error) }
    </div>
  );
}

export default Card;

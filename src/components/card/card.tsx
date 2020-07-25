import React, { useState, useEffect } from 'react';
// 
import CardHeader from './cardHeader';
import CardContent from './cardContent';
import CardActions from './cardActions';
import CardError from './cardError';
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
  className?: string
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Card = (props: CardProps) => {

  // STATE
  // every state is apt part of the card
  const [ header, setHeader ] = useState(null);
  const [ content, setContent ] = useState(null);
  const [ actions, setActions ] = useState(null);
  const [ errors, setErrors ] = useState(null);


  // UTILS
  /**
   * Returns the string, containing classes for the root element
   */
  const getClasses = (): string => {
    const classes = [
      'card',
      'card--shadow'
    ];
    return classes.join(' ');
  }


  // HOOKS
  useEffect(() => {

    // function checks, whether obj is React element or not
    //
    const isReactElement = (obj: React.ReactElement<{}>): boolean => {
      return obj.hasOwnProperty('type');
    }
    // next functions check, what part of the card react element is
    //
    // Card Header
    const isCardHeader = (obj: React.ReactElement<{}>): boolean => {
      return isReactElement(obj) && obj.type === CardHeader;
    }
    // Card Content
    const isCardContent = (obj: React.ReactElement<{}>): boolean => {
      return isReactElement(obj) && obj.type === CardContent;
    }
    // Card Actions
    const isCardActions = (obj: React.ReactElement<{}>): boolean => {
      return isReactElement(obj) && obj.type === CardActions;
    }
    // Card Error
    const isCardError = (obj: React.ReactElement<{}>): boolean => {
      return isReactElement(obj) && obj.type === CardError;
    }


    // get children from props
    const { children } = props;
    // 
    React.Children.forEach(children, (item: any) => {
      
      // Header
      if (isCardHeader(item)) {
        setHeader(item);

      // Content
      } else if (isCardContent(item)) {
        setContent(item);

      // Actions
      } else if (isCardActions(item)) {
        setActions(item);

      // Errors
      } else if (isCardError(item)) {
        setErrors(item);

      }
    });

  }, [props]);


  // RENDER
  return (
    <div className={ getClasses() }>
      {/* Header */}
      { header}
      {/* Content */}
      { content }
      {/* Action */}
      { actions }
      {/* Error */}
      { errors }
    </div>
  );
}

export default Card;

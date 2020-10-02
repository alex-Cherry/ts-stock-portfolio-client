import React, { useState, useEffect } from 'react';
// custom components
import CardHeader from './cardHeader';
import CardContent from './cardContent';
import CardActions from './cardActions';
import CardError from './cardError';
// third-party libs
import classNames from 'classnames';
// css
import './card.scss';


// DESCRIPTION:
// 
// This component is a convenient method to display content composed of different types of objects.
// 
// The component may consist of four block types:
// - CardHeader - the header of the card
// - CardContent - displays the card content
// - CardActions - usually consist of buttons
// - CardError - an error description
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type CardProps = {
  children: React.ReactNode,
  // Extra classes, that you can apply to the root element,
  //  when you use this component inside other ones.
  // It's assumed that will be used classes that define
  //  positioning of the component
  className?: string
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Card = (props: CardProps) => {

  // ===< STATE >===
  // 
  // Every state is an apt part of the card
  const [ header, setHeader ] = useState(null);
  const [ content, setContent ] = useState(null);
  const [ actions, setActions ] = useState(null);
  const [ errors, setErrors ] = useState(null);


  // ===< UTILS >===
  // 
  /**
   * Returns the string, containing classes for the root element
   */
  const getClasses = (): string => {
    const classes = classNames(
      'card',
      'card--shadow'
    );
    return classes;
  }


  // ===< HOOKS >===
  // 
  useEffect(() => {

    // Function checks, whether obj is a React element or not
    //
    const isReactElement = (obj: React.ReactElement<{}>): boolean => {
      return obj.hasOwnProperty('type');
    }
    // The next functions check, what part of the card a react element is
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


    // Get the children from the props
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


  // ===< RENDER >===
  // 
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

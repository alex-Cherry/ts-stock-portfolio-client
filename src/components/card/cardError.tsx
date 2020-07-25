import React from 'react';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type CardErrorsProps = {
  // string, containing the definition of the error.
  // if there are a few errors, they differ each from other with semicolon
  children: string
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const CardErrors = (props: CardErrorsProps) => {

  // 
  const renderErrors = () => {

    const errors = props.children;

    // if there aren't children, return null
    if (!errors) {
      return null;
    }

    // get an array of errors from the children-string
    const data: string[] = errors.split(';');

    // map each string in the array to "ul-li" html-element
    return (
      <div className="card__errors">
        <ul>
          {
            data
              .filter(item => !!item)
              .map((item, index) => (<li className="card__errors-item" key={index}>{item}</li>))
          }
        </ul>
      </div>
    );
  }

  return renderErrors();
}

export default CardErrors;

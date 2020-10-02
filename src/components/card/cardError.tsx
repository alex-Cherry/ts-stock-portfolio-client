import React from 'react';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type CardErrorsProps = {
  // The string, containing the definition of an error.
  // If there are a few errors, they must differ each from other with semicolon
  children: string
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const CardErrors = (props: CardErrorsProps) => {


  // ===< UTILS >===
  // 
  /**
   * Func renders the errors from the props or null
   */
  const renderErrors = () => {

    const errors = props.children;

    // If there aren't children, return null
    if (!errors) {
      return null;
    }

    // Get an array of errors from the children-string
    const data: string[] = errors.split(';');

    // Map each string in the array to "ul-li" html-element
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


  // ===< RENDER >===
  // 
  return renderErrors();
}

export default CardErrors;

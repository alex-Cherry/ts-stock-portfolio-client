import React from 'react';
// third-party libs
import classNames from 'classnames';
// css
import './logo.scss';
// img
import logoImg from '../../../assets/images/buy1.png';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type LogoProps = {
  // Extra classes, that you can apply to the root element,
  // when you use this component inside other ones.
  // It's assumed that will be used classes that define
  // positioning of the component
  className?: string
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const Logo = (props: LogoProps) => {

  // ===< UTILS >===
  // 
  /**
   * Defines classes, that need to apply to the root element
   */
  const getClasses = () => {
    
    const {
      className = ''
    } = props;

    const classes = classNames(
      // define default classes
      'logo',
      // extra classes
      { [`${className}`]: !!className }  
    );

    return classes;
  }


  // ===< RENDER >===
  // 
  return (
    <div className={ getClasses() }>
      <a className="logo__link" href="/">
        <img className="logo__img" src={ logoImg } alt="" />
        <span className="logo__text">StockPortfolio</span>
      </a>
    </div>
  );
}

export default Logo;

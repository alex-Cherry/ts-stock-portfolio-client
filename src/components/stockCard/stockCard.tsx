import React, { useRef } from 'react';
// custom components
import AddFavorite from './addFavorite';
import ActionPanel from './actionPanel';
// third-party libs
import classNames from 'classnames';
// utils
import { toRubles } from '../../utils/toRubles';
import { setClass, removeClass } from '../../utils/checkClassesForRefObjects';
// types
import { ExtendedStock } from '../../types';
// css
import './stockCard.scss';


// DESCRIPTION:
// 
// This component displays a stock. The stock is passed in properties.
// 
// The component consists of three parts:
//  - "Content", where the ticker and the price of the stock are rendered;
//  - "ActionPanel", where the buttons which allow to manipulate with the stock are rendered;
//  - "AddFavorite", where "Star" image is rendered.
//      Clicking on the star, you can add the stock to favorite or remove one from favorite;
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// PROPS
type StockCardProps = {
  // The stock to render
  stock: ExtendedStock,
  // Extra classes, that you can apply to the root element,
  //  when you use this component inside other ones.
  // It's assumed that will be used classes that define
  //  positioning of the component
  className?: string
};

// CONTEXT
export const StockContext = React.createContext(new ExtendedStock());


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const StockCard = (props: StockCardProps) => {

  const { stock } = props;
  // classes for blocks
  const classDivFavoriteActive = 'stock-card__favorite--active';
  const classDivActionVisible = 'stock-card__action--visible';
  // refs
  const divActionRef = useRef<HTMLDivElement>(null);
  const divFavoriteRef = useRef<HTMLDivElement>(null);


  // ===< EVENT HANDLERS >===
  //
  // => "onMouseEnter"
  const onMouseEnterHandler = () => {
    // removeClass(refDiv, 'd-none');
    setClass(divActionRef, classDivActionVisible);
    setClass(divFavoriteRef, classDivFavoriteActive);
  }
  // => "onMouseLeave"
  const onMouseLeaveHandler = () => {
    // setClass(refDiv, 'd-none');
    removeClass(divActionRef, classDivActionVisible);
    removeClass(divFavoriteRef, classDivFavoriteActive);
  }


  // ===< UTILS >===
  //
  /**
   * Defines classes to apply to the root element
   */
  const getClasses = (): string => {
    const { className = '' } = props;
    // define classes with "classnames" lib
    const classes = classNames(
      // defualt classes
      'stock-card',
      // classes from props
      { [`${className}`]: !!className }
    );
    return classes;
  }


  // ===< RENDER >===
  //
  return (
    <StockContext.Provider value={stock}>
      <div
        className={ getClasses() }
        onMouseEnter={ onMouseEnterHandler }
        onMouseLeave={ onMouseLeaveHandler }
      >
        {/* Title */}
        <span className="stock-card__title">{ stock.ticker }</span>
        {/* Price */}
        <span className="stock-card__price">{ toRubles(stock.price) }</span>

        {/* Action Panel - buttons */}
        <div
          className="stock-card__action-panel"
          ref={ divActionRef }
        >
          <ActionPanel />
        </div>

        {/* icon "Favorite" */}
        <div
          className="stock-card__favorite"
          ref={ divFavoriteRef }
        >
          <AddFavorite />
        </div>

      </div>

    </StockContext.Provider>
  );
}

export default StockCard;

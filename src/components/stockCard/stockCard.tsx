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


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type StockCardProps = {
  stock: ExtendedStock,
  // extra classes, that you can apply to the root element,
  // when you use this component inside other ones.
  // It's assumed that will be used classes that define
  // positioning of the component
  className?: string
};

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


  // EVENT HANDLERS
  const onMouseEnterHandler = () => {
    // removeClass(refDiv, 'd-none');
    setClass(divActionRef, classDivActionVisible);
    setClass(divFavoriteRef, classDivFavoriteActive);
  }
  const onMouseLeaveHandler = () => {
    // setClass(refDiv, 'd-none');
    removeClass(divActionRef, classDivActionVisible);
    removeClass(divFavoriteRef, classDivFavoriteActive);
  }


  // UTILS
  /**
   * defines classes, that need to apply to the root element
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


  // RENDER
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

////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////
import React, { useState, useRef } from 'react';
// import custom elements
import AddFavorite from './addFavorite';
import ActionPanel from './actionPanel';
// import utils
import { toRubles } from '../../utils/toRubles';
import { setClass, removeClass } from '../../utils/checkClassesForRefObjects';
// import types
import { ExtendedStock } from '../../types';

// import css
import './stockCard.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type StockCardProps = {
  stock: ExtendedStock
};

export const StockContext = React.createContext(new ExtendedStock());

////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////
const StockCard = (props: StockCardProps) => {

  const { stock } = props;
  // refs
  const divRef = useRef<HTMLDivElement>(null);
  const divFavoriteRef = useRef<HTMLDivElement>(null);
  // state
  const [ favorite, setFavorite ] = useState(stock.isFavorite);

  // EVENT HANDLERS
  const onMouseEnterHandler = () => {
    // removeClass(refDiv, 'd-none');
    setClass(divRef, 'opacity_1');
    setClass(divFavoriteRef, 'active');
  }
  const onMouseLeaveHandler = () => {
    // setClass(refDiv, 'd-none');
    removeClass(divRef, 'opacity_1');
    removeClass(divFavoriteRef, 'active');
  }
  const onClickAddFavoriteHandler = () => {
    // plug
    setFavorite(state => !state)
  }

  // RENDER
  return (
    <StockContext.Provider value={stock}>
      <div
        className="stock-card"
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
      >
        <span className="title">{stock.ticker}</span>
        <span>{toRubles(stock.price)}</span>

        <div
          className="action"
          ref={divRef}
        >
          <ActionPanel />
        </div>

        {/* icon "Favorite" */}
        <div
          className="stock-card-favorite"
          ref={divFavoriteRef}
        >
          <AddFavorite
            active={favorite}
            onClick={onClickAddFavoriteHandler}
          />
        </div>

      </div>

    </StockContext.Provider>
  );
}

export default StockCard;

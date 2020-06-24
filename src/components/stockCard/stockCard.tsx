////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////
import React, { useState, useRef } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
// import custom elements
import Tooltip from '../tooltip';
import AddFavorite from './addFavorite';
import ActionPanel from './actionPanel';
// import store
import { addToast } from '../../store/toasts/actions';
import { ToastWithoutId } from '../../store/toasts/types';
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

const mapDispatch = (dispatch: any) => {
  return {
    addToast: (toast: ToastWithoutId) => dispatch(addToast(toast))
  }
}

const connector = connect(null, mapDispatch);

type StockCardProps = {
  stock: ExtendedStock
}
  & RouteComponentProps
  & ConnectedProps<typeof connector>;

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
  const iPlusRef = useRef<HTMLElement>(null);
  const iMinusRef = useRef<HTMLElement>(null);
  const iEditRef = useRef<HTMLElement>(null);
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
  const addStockToPortfolio = () => {
    // const { stock: { ticker } } = props;
    // // create message for toast
    // const text = `Акция ${ticker} добавлена в портфель.`;

    // setActionPanelLoading(true);
    // // push a toast
    // toast(text);
  }
  const removeStockFromPortfolio = () => {
    // const { stock: { ticker } } = props;
    // // create message for toast
    // const text = `Акция ${ticker} удалена из портфеля.`;

    // setActionPanelLoading(true);
    // // push a toast
    // toast(text);
  }
  const onClickAddFavoriteHandler = () => {
    // plug
    setFavorite(state => !state)
  }

  // UTILS
  const toast = (message: string) => {
    // // get addToast() from props
    // const { addToast } = props;
    // // 
    // const timeoutId = setTimeout(() => {
    //   const newToast: ToastWithoutId = {
    //     text: message
    //   };
    //   addToast(newToast);
    //   setActionPanelLoading(false);
    //   // clear timeout resource
    //   clearTimeout(timeoutId);
    // }, 1000);
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

      <Tooltip
        text="Добавить акцию в потрфель"
        elementRef={iPlusRef}
      />

      <Tooltip
        text="Удалить акцию из потрфеля"
        elementRef={iMinusRef}
      />

      <Tooltip
        text="Редактировать акцию"
        elementRef={iEditRef}
      />

    </StockContext.Provider>
  );
}

export default connector(
  withRouter(
    StockCard
  )
);

import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
// custom components
import MaterialIcon from '../materialIcon';
import Spinner from '../circleSpinner';
// context
import { StockContext } from './stockCard';
// store
import { addToast } from '../../store/toasts/actions';
import { ToastWithoutId } from '../../store/toasts/types';
// types
import { ExtendedStock } from '../../types';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

const mapDispatch = (dispatch: any) => {
  return {
    toast: (newToast: ToastWithoutId) => dispatch(addToast(newToast))
  }
}
const connector = connect(null, mapDispatch);

type ActionPanelProps = {
}
  & RouteComponentProps
  & ConnectedProps<typeof connector>;


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const ActionPanel = (props: ActionPanelProps) => {

  // loading = executing any operation from the action panel
  const [ loading, setLoading ] = useState(false);
  // when loading, show spinner instead of commands from the action panel
  if (loading) {
    return (
      <div className="stock-card__action-spinner">
        <Spinner />
      </div>
    );
  }


  // EVENT HANDLERS
  const onClickAddStockToPortfolioHandler = (stock: ExtendedStock) => {
    const { ticker } = stock;
    // create message for toast
    const text = `Акция ${ticker} добавлена в портфель.`;

    setLoading(true);
    // push a toast
    doToast(text);
  }
  const onClickRemoveStockFromPortfolio = (stock: ExtendedStock) => {
    const { ticker } = stock;
    // create message for toast
    const text = `Акция ${ticker} удалена из портфеля.`;

    setLoading(true);
    // push a toast
    doToast(text);
  }
  const onClickEditStockHandler = (stock: ExtendedStock) => {
    const { history: { push } } = props;
    const {id} = stock;
    // go to page "EditStockPage"
    push(`/editStock?id=${id}`);
  }


  // UTILS
  /**
   * 
   * 
   * @param {string} message - a message that emerges when any action is being done
   */
  const doToast = (message: string) => {
    // get action from props
    const { toast } = props;
    
    // timeout is dummy.
    // emulate a delay while excuting a network request.
    // 
    const timeId = setTimeout(() => {
      setLoading(false);
      // when create a new toast, we don't know its id.
      // so use class without id
      const newToast: ToastWithoutId = {
        text: message
      };
      // push a toast
      toast(newToast);
      // 
      clearTimeout(timeId);
    }, 2000);
  }
  /**
   * returns the panel with available commands
   * 
   * @param {ExtendedStock} stock - a stock, which the action panel is rendered for
   */
  const renderActionPanel = (stock: ExtendedStock) => {
    return (
      <div>
        {/* Add stock to portfolio */}
        <MaterialIcon
          className="stock-card__action-icon"
          iconName="add_circle_outline"
          onClick={ () => onClickAddStockToPortfolioHandler(stock) }
        />
        {/* Remove stock from portfolio */}
        <MaterialIcon
          className="stock-card__action-icon"
          iconName="remove_circle_outline"
          onClick={ () => onClickRemoveStockFromPortfolio(stock) }
        />
        {/* Edit stock */}
        <MaterialIcon
          className="stock-card__action-icon"
          iconName="edit"
          onClick={ () => onClickEditStockHandler(stock) }
        />
      </div>
    );
  }


  // RENDER
  return (
    <StockContext.Consumer>
      { (stock: ExtendedStock) => renderActionPanel(stock) }
    </StockContext.Consumer>
  );
}

export default connector(
  withRouter(
    ActionPanel
  )
);

import React, { useRef, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { v4 as uuid } from 'uuid';
// custom components
import MaterialIcon from '../materialIcon';
import Spinner from '../circleSpinner';
import Tooltip from '../tooltip';
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

// MAP DISPATCH
const mapDispatch = (dispatch: any) => {
  return {
    toast: (newToast: ToastWithoutId) => dispatch(addToast(newToast))
  }
}

// PROPS
const connector = connect(null, mapDispatch);
type ActionPanelProps = ConnectedProps<typeof connector>
  & RouteComponentProps;


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const ActionPanel = (props: ActionPanelProps) => {

  // ===< STATE >===
  // 
  // This flag indicates that an operation from the action panel is executing
  const [ loading, setLoading ] = useState(false);
  // These variables store the id-s of the buttons
  const elementIdAddStock = useRef(`addStock_${uuid()}`);
  const elementIdRemoveStock = useRef(`removeStock_${uuid()}`);
  const elementIdEditStock = useRef(`editStock_${uuid()}`);

  // When loading, show the spinner instead of commands from the action panel
  if (loading) {
    return (
      <div className="stock-card__action-spinner">
        <Spinner />
      </div>
    );
  }


  // ===< EVENT HANDLERS >===
  // 
  // => Add stock to portfolio
  const onClickAddStockToPortfolioHandler = (stock: ExtendedStock) => {
    const { ticker } = stock;
    // Create a message for a toast
    const text = `Акция ${ticker} добавлена в портфель.`;

    setLoading(true);
    // push the toast
    doToast(text);
  }
  // => Remove stock from portfolio
  const onClickRemoveStockFromPortfolio = (stock: ExtendedStock) => {
    const { ticker } = stock;
    // Create a message for a toast
    const text = `Акция ${ticker} удалена из портфеля.`;

    setLoading(true);
    // Push the toast
    doToast(text);
  }
  // => Edit stock
  const onClickEditStockHandler = (stock: ExtendedStock) => {
    const { history: { push } } = props;
    const {id} = stock;
    // Go to the page "EditStockPage"
    push(`/editStock?id=${id}`);
  }


  // ===< UTILS >===
  // 
  /**
   * Pushes a new message to the toast "stack"
   * 
   * @param {string} message - the message of the toast
   */
  const doToast = (message: string) => {
    // Get the action from the props
    const { toast } = props;
    
    // Timeout is dummy.
    // Emulate a delay while excuting a network request.
    // 
    const timeId = setTimeout(() => {
      setLoading(false);
      // When create a new toast, we don't know its id,
      //  so use the class without id
      const newToast: ToastWithoutId = {
        text: message
      };
      // Push the toast
      toast(newToast);
      // 
      clearTimeout(timeId);
    }, 2000);
  }
  /**
   * => getIdAddStock()
   * 
   * Returns id for the button "Add stock to the portfolio"
   */
  const getIdAddStock = (): string => {
    return elementIdAddStock.current;
  }
  /**
   * => getIdRemoveStock()
   * 
   * Returns id for the button "Remove stock from the portfolio"
   */
  const getIdRemoveStock = (): string => {
    return elementIdRemoveStock.current;
  }
  /**
   * => getIdEditStock()
   * 
   * Returns id for the button "Edit stock"
   */
  const getIdEditStock = (): string => {
    return elementIdEditStock.current;
  }
  /**
   * Returns the panel with available commands
   * 
   * @param {ExtendedStock} stock - the stock, which the action panel is rendered for
   */
  const renderActionPanel = (stock: ExtendedStock) => {

    return (
      <>
        <div>
          {/* Add stock to portfolio */}
          <MaterialIcon
            className="stock-card__action-icon"
            iconName="add_circle_outline"
            id={ getIdAddStock() }
            onClick={ () => onClickAddStockToPortfolioHandler(stock) }
          />
          {/* Remove stock from portfolio */}
          <MaterialIcon
            className="stock-card__action-icon"
            iconName="remove_circle_outline"
            id={ getIdRemoveStock() }
            onClick={ () => onClickRemoveStockFromPortfolio(stock) }
          />
          {/* Edit stock */}
          <MaterialIcon
            className="stock-card__action-icon"
            iconName="edit"
            id={ getIdEditStock() }
            onClick={ () => onClickEditStockHandler(stock) }
          />
        </div>

        <Tooltip
          text="Добавить в портфель"
          elementId={ getIdAddStock() }
        />
        <Tooltip
          text="Удалить из портфеля"
          elementId={ getIdRemoveStock() }
        />
        <Tooltip
          text="Редактировать акцию"
          elementId={ getIdEditStock() }
        />

      </>
    );
  }


  // ===< RENDER >===
  // 
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

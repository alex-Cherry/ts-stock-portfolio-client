import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
// 

import MaterialIcon from '../materialIcon';
import Spinner from '../circleSpinner';
import { StockContext } from './stockCard';
// 
import { addToast } from '../../store/toasts/actions';
import { ToastWithoutId } from '../../store/toasts/types';
// import types
import { ExtendedStock } from '../../types';


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


const ActionPanel = (props: ActionPanelProps) => {

  const [ loading, setLoading ] = useState(false);

  if (loading) {
    return (
      <div className="action-item-wrapper">
        <Spinner />
      </div>
    );
  }

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
    push(`/editStock?id=${id}`);
  }
  const doToast = (message: string) => {
    const { toast } = props;
    
    const timeId = setTimeout(() => {
      setLoading(false);
      const newToast: ToastWithoutId = {
            text: message
          };
      toast(newToast);
      clearTimeout(timeId);
    }, 2000);

  }

  return (
    <StockContext.Consumer>
      {(stock: ExtendedStock) => (
          <div>
            <MaterialIcon
              iconName="add_circle_outline"
              onClick={() => onClickAddStockToPortfolioHandler(stock)}
            />
            <MaterialIcon
              iconName="remove_circle_outline"
              onClick={() => onClickRemoveStockFromPortfolio(stock)}
            />
            <MaterialIcon
              iconName="edit"
              onClick={() => onClickEditStockHandler(stock)}
            />
        </div>
      )}
    </StockContext.Consumer>
  );
}

export default connector(
  withRouter(
    ActionPanel
  )
);

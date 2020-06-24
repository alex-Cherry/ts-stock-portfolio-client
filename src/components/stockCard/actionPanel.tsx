import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
// 
import { ElementRef } from '../../utils/checkClassesForRefObjects';

import MaterialIcon from '../materialIcon';
import Spinner from '../circleSpinner';
import { StockContext } from './stockCard';
// import types
import { ExtendedStock } from '../../types';



export type ActionPanelItem = {
  iconName: string,
  ref: ElementRef<HTMLElement>,
  onClickHandler: () => void
}

type ActionPanelProps = {
} & RouteComponentProps;

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
    setLoading(true);
    const timeId = setTimeout(() => {
      setLoading(false);
      console.log('stock was added to portfolio')
      clearTimeout(timeId);
    }, 2000);
  }
  const onClickRemoveStockFromPortfolio = (stock: ExtendedStock) => {
    setLoading(true);
    const timeId = setTimeout(() => {
      setLoading(false);
      console.log('stock was removed from portfolio')
      clearTimeout(timeId);
    }, 2000);
  }
  const onClickEditStockHandler = (stock: ExtendedStock) => {
    const { history: { push } } = props;
    const {id} = stock;
    push(`/editStock?id=${id}`);
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

export default withRouter(ActionPanel);

////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////

import React from 'react';
// import custom components
import StockCard from './stockCard';
// import types
import { ExtendedStock } from '../types';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type StocksBoardProps = {
  stocks: ExtendedStock[]
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const StocksBoard = (props: StocksBoardProps) => {

  const { stocks } = props;
  // 
  const generateContent = () => {
    return stocks.map(
      (stock: ExtendedStock) => (
        <StockCard
          key={stock.id}
          stock={stock}
        />
      )
    )
  }

  // RENDER
  return (
    <div className="d-flex flex-wrap">
      { generateContent() }
    </div>
  );
}

export default StocksBoard;
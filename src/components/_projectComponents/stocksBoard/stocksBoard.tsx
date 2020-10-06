import React from 'react';
// Custom components
import StockCard from '../../stockCard';
// Types
import { ExtendedStock } from '../../../types';
// CSS
import './stocksBoard.scss';


// DESCRIPTION:
// 
// This component just renders stocks, defined in the props.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type StocksBoardProps = {
  // Stocks to render
  stocks: ExtendedStock[]
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const StocksBoard = (props: StocksBoardProps) => {

  // ===< UTILS >===
  // 
  /**
   * Func renders stocks
   */
  const generateContent = () => {
    const { stocks } = props;

    return stocks.map((stock: ExtendedStock) => (
      <StockCard
        key={ stock.id }
        stock={ stock }
        className="stocks-board__stock-card"
      />
    ))
  }


  // ===< RENDER >===
  // 
  return (
    <div className="stocks-board">
      { generateContent() }
    </div>
  );
}

export default StocksBoard;

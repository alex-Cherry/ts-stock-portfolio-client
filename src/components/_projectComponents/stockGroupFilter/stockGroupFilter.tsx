import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
// Custom elements
import Badge from '../../badge';
// CSS
import './stockGroupFilter.scss';


// DESCRIPTION:
// 
// This component allows to set a filter what stocks to render.
// There are three options:
// - ALL - show all stocks.
// - BLUETIPS - show stocks which belong to the category "Bluetip". Such stocks have the flag "Bluetip".
// - BY_SECTORS - !!! it's not realized.
// 
// Options of the filter are realized with the enum "StockGroupFilterOperations",
//  described in this file.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// Define types of filter
export enum StockGroupFilterOperations {
  ALL,
  BLUETIPS,
  BY_SECTORS
};

// PROPS
type StockGroupFilterProps = RouteComponentProps
  & {
    // An initial filter.
    // Value by default = "StockGroupFilterOperations.ALL"
    initialFilter?: StockGroupFilterOperations,

    // => Events
    // Occurs when an option in the filter changes
    onChangeFilter?: (filter: StockGroupFilterOperations) => void
  };


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const StockGroupFilter = (props: StockGroupFilterProps) => {

  const {
    initialFilter = StockGroupFilterOperations.ALL
  } = props;


  // ===< STATE >===
  // 
  // The state stores the current filter
  const [ componentFilter, setFilter ] = useState(initialFilter);


  // ===< EVENT HANDLERS >===
  // 
  // => All Stocks - "onClick"
  const onClickAllStocksHandler = () => {
    changeFilter(StockGroupFilterOperations.ALL);
  }
  // => Bluetip Stocks - "onClick"
  const onClickBluetipsHandler = () => {
    changeFilter(StockGroupFilterOperations.BLUETIPS);
  }
  // => Stocks by Sectors - "onClick"
  const onClickBySectorsHandler = () => {
    changeFilter(StockGroupFilterOperations.BY_SECTORS);
  }


  // ===< UTILS >===
  // 
  /**
   * The func sets the filter
   *  and launch an event from the props
   * 
   * @param {StockGroupFilterOperations} filter - the new filter
   */
  const changeFilter = (filter: StockGroupFilterOperations): void => {
    
    const {
      onChangeFilter = () => {}
    } = props;

    // If the new filter doesn't equal to the current,
    //  set one and raise an event, got from the props
    if (!isFilter(filter)) {
      setFilter(filter);
      onChangeFilter(filter);
    }
  }
  /**
   * Compares the passed filter to current one.
   * Returns "true" if the filters are equal,
   *  otherwise "false"
   * 
   * @param {StockGroupFilterOperations} filter - the filter that compares to the current filter in the state
   */
  const isFilter = (filter: StockGroupFilterOperations): boolean => {
    return componentFilter === filter;
  }


  // ===< RENDER >===
  // 
  return (
    <div className="stock-filter">
      {/* All Stocks */}
      <Badge
        text='Все акции'
        className="stock-filter__badge"
        active={ isFilter(StockGroupFilterOperations.ALL) }
        onClick={ onClickAllStocksHandler }
      />
      {/* Bluetip Stocks */}
      <Badge
        text='Голубые фишки'
        className="stock-filter__badge"
        active={ isFilter(StockGroupFilterOperations.BLUETIPS) }
        onClick={ onClickBluetipsHandler }
      />
      {/* Stocks by Sectors */}
      <Badge
        text='По отраслям'
        className="stock-filter__badge"
        active={ isFilter(StockGroupFilterOperations.BY_SECTORS) }
        onClick={ onClickBySectorsHandler }
      />
    </div>
  );
}

export default withRouter(StockGroupFilter);

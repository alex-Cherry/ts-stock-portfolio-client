import React, { useState } from 'react';
import { withRouter,  RouteComponentProps } from 'react-router-dom';
// import custom elements
import Badge from '../badge';
// import css
import './stockGroupFilter.scss';

export enum StockGroupFilterOperations {
  ALL,
  BLUETIPS,
  BY_SECTORS
};

type StockGroupFilterExtraProps = {
  initialFilter?: StockGroupFilterOperations,
  onChangeFilter?: (filter: StockGroupFilterOperations) => void
};

type StockGroupFilterProps = StockGroupFilterExtraProps
  & RouteComponentProps;


const StockGroupFilter = (props: StockGroupFilterProps) => {

  const {
    initialFilter = StockGroupFilterOperations.ALL
  } = props;
  const [ componentFilter, setFilter ] = useState(initialFilter);

  const onClickAllStocksHandler = () => {
    changeFilter(StockGroupFilterOperations.ALL);
  }
  const onClickBluetipsHandler = () => {
    changeFilter(StockGroupFilterOperations.BLUETIPS);
  }
  const onClickBySectorsHandler = () => {
    changeFilter(StockGroupFilterOperations.BY_SECTORS);
  }

  // UTILS
  const changeFilter = (filter: StockGroupFilterOperations) => {
    
    const {
      onChangeFilter = () => {}
    } = props;

    if (!isFilter(filter)) {
      setFilter(filter);
      onChangeFilter(filter);
    }
  }
  const isFilter = (filter: StockGroupFilterOperations) => {
    return componentFilter === filter;
  }

  return (
    <div className="stock-group-filter">
      <Badge
        text='Все акции'
        className="stock-group-filter__badge"
        active={isFilter(StockGroupFilterOperations.ALL)}
        onClick={onClickAllStocksHandler}
      />
      <Badge
        text='Голубые фишки'
        className="stock-group-filter__badge"
        active={isFilter(StockGroupFilterOperations.BLUETIPS)}
        onClick={onClickBluetipsHandler}
      />
      <Badge
        text='По отраслям'
        className="stock-group-filter__badge"
        active={isFilter(StockGroupFilterOperations.BY_SECTORS)}
        onClick={onClickBySectorsHandler}
      />
    </div>
  );
}

export default withRouter(StockGroupFilter);

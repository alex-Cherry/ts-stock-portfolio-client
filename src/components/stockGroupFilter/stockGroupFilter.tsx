import React from 'react';
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
  activeId: StockGroupFilterOperations,
  onChangeFilter?: (filter: StockGroupFilterOperations) => void
};

type StockGroupFilterProps = StockGroupFilterExtraProps
  & RouteComponentProps;


const StockGroupFilter = (props: StockGroupFilterProps) => {

  const {
    activeId,
    onChangeFilter = (filter: StockGroupFilterOperations) => {}
  } = props;

  const onClickItemHandler = (id: StockGroupFilterOperations) => {
    onChangeFilter(id);
  }

  const items = [
    { id: StockGroupFilterOperations.ALL, text: 'Все акции', handler: () => onClickItemHandler(StockGroupFilterOperations.ALL) },
    { id: StockGroupFilterOperations.BLUETIPS, text: 'Голубые фишки', handler: () => onClickItemHandler(StockGroupFilterOperations.BLUETIPS) },
    { id: StockGroupFilterOperations.BY_SECTORS, text: 'По отраслям', handler: () => onClickItemHandler(StockGroupFilterOperations.BY_SECTORS) }
  ];

  return (
    <div className="stock-group-filter">
      {
        items.map(item => {
          return <Badge
            key={item.id}
            text={item.text}
            className={ item.id === activeId ? 'active' : '' }
            onClick={ item.id === activeId ? () => {} : item.handler}
          />;
        })
      }
    </div>
  );
}

export default withRouter(StockGroupFilter);

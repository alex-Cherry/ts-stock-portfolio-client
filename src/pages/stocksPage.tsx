////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
// import store
import { AppState } from '../store';
import { fetchStocks } from '../store/stocks/action';
// import custom components
import MainContainer from '../components/mainContainer';
import StocksBoard from '../components/stocksBoard';
import StockGroupFilter, { StockGroupFilterOperations } from '../components/stockGroupFilter';
import FloatingButton from '../components/floatingButton';
import Spinner from '../components/spinner';
import ErrorIndicator from '../components/errorIndicator';
// import utils
import { getQueryParams } from '../utils/getQueryParams';
// import types
import { ExtendedStock } from '../types';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

const mapState = (state: AppState) => {
  return {
    isAdmin: !!state.auth.user?.isAdmin,
    stocks: state.stocks.stocks
  }
}
const mapDispatch = (dispatch: any) => {
  return {
    fetchStocks: (bluetip: boolean = false) => dispatch(fetchStocks(bluetip))
  }
}

const connector = connect(mapState, mapDispatch);
// Props
type StocksPageProps = ConnectedProps<typeof connector>
  & RouteComponentProps;
// State
type StocksPageState = {
  stocks: ExtendedStock[],
  loading: boolean,
  hasError: boolean,
  filter: StockGroupFilterOperations
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class StocksPage extends React.Component<StocksPageProps, StocksPageState> {

  // FIELDS
  private mounted: boolean = true;

  // CONSTRUCTOR
  constructor(props: StocksPageProps) {
    super(props);

    // STATE
    this.state = {
      stocks: [],
      loading: true,
      hasError: false,
      filter: this.getInitialFilter()
    }
  }

  // LIFECYCLE
  componentDidMount = () => {
    this.fetchData();
  }
  componentDidUpdate = (prevProps: StocksPageProps, prevState: StocksPageState) => {
    const { filter } = this.state;
    if (prevState.filter !== filter) {
      this.fetchData();
    }
  }
  componentWillUnmount = () => {
    this.mounted = false;
  }

  // EVENT HANDLERS
  onClickAddStockHandler = () => {
    const { history } = this.props;
    history.push('/editStock');
  }
  onChangeFilterHandler = (filter: StockGroupFilterOperations) => {
    this.setState({ filter });
    if (filter === StockGroupFilterOperations.ALL) {
      this.props.history.push('/stocks')
    } else if (filter === StockGroupFilterOperations.BLUETIPS) {
      this.props.history.push('/stocks?bluetip=true')
    }
  }

  // UTILS
  getInitialFilter = (): StockGroupFilterOperations => {
    const { location: { search } } = this.props;
    const queryParams = getQueryParams(search);
    const bluetip = !!queryParams.bluetip;

    let result = StockGroupFilterOperations.ALL;

    if (bluetip) {
      result = StockGroupFilterOperations.BLUETIPS;
    }

    return result;
  }
  fetchData = () => {

    const { fetchStocks } = this.props;
    const { filter } = this.state;
    const bluetip = (filter === StockGroupFilterOperations.BLUETIPS);

    this.setState({ loading: true });

    fetchStocks(bluetip)
      .catch(
        () => { this.mounted && this.setState({ hasError: true }) }
      )
      .finally(
        () => { this.mounted && this.setState({ loading: false }) }
      );
  }
  renderContent = () => {
    const { stocks } = this.props;
    const { loading } = this.state;

    if (loading) {
      return <Spinner />;
    } else {
      return <StocksBoard stocks={stocks} />;
    }
  }

  // RENDER
  render() {
    // throw new Error('dsaadsd')
    const { isAdmin, stocks } = this.props;
    const { hasError, filter } = this.state;

    // component has an error
    if (hasError || !stocks) {
      return <ErrorIndicator />;
    }

    // Main content
    return (
      <MainContainer>

        <h1>Акции</h1>
        {/* Filter */}
        <StockGroupFilter
          initialFilter={filter}
          onChangeFilter={this.onChangeFilterHandler}
        />

        {/* Render Stocks */}
        { this.renderContent() }
        
        {/* Add Stock button */}
        {isAdmin && (
          <FloatingButton
            iconName="add"
            isFixed={true}
            onClick={this.onClickAddStockHandler}
          />
        )}

      </MainContainer>
    );
  }
}

export default connector(StocksPage);

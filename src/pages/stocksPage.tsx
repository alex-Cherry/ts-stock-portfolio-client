import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
// store
import { AppState } from '../store';
import { fetchStocks } from '../store/stocks/action';
// custom components
import MainContainer from '../components/_projectComponents/mainContainer';
import StocksBoard from '../components/_projectComponents/stocksBoard';
import StockGroupFilter, { StockGroupFilterOperations } from '../components/_projectComponents/stockGroupFilter';
import FloatingButton from '../components/floatingButton';
import Loader from '../components/loader';
// import ErrorIndicator from '../components/errorIndicator';
// utils
import { getQueryParams } from '../utils/getQueryParams';
// types
import { ExtendedStock } from '../types';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// MAP STATE
const mapState = (state: AppState) => {
  return {
    isAdmin: !!state.auth.user?.isAdmin,
    stocks: state.stocks.stocks
  }
}

// MAP DISPATCH
const mapDispatch = (dispatch: any) => {
  return {
    fetchStocks: (bluetip: boolean = false) => dispatch(fetchStocks(bluetip))
  }
}

// PROPS
const connector = connect(mapState, mapDispatch);
type StocksPageProps = ConnectedProps<typeof connector>
  & RouteComponentProps;

// STATE
type StocksPageState = {
  // Stocks that must be displayed on the page
  stocks: ExtendedStock[],
  // This flag indicates that an async operation is executing
  loading: boolean,
  // This flag indicates that an error occured while an operation executing
  hasError: boolean,
  // Defines the condition what stocks must be displayed
  filter: StockGroupFilterOperations
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class StocksPage extends React.Component<StocksPageProps, StocksPageState> {

  // ===< CLASS FIELDS >===
  // 
  // This field stores the mark that DOM is rendered.
  // An user can start async operations and don't wait until they finished.
  // In that case leak memories can have place.
  // 
  // So we use this field in async operations to not interact with the component,
  //  when DOM is already (or yet) not rendered
  private mounted: boolean = true;


  // ===< CONSTRUCTOR >===
  // 
  constructor(props: StocksPageProps) {
    super(props);

    // ===< STATE >===
    // 
    this.state = {
      stocks: [],
      loading: true,
      hasError: false,
      filter: this.getInitialFilter()
    }
  }


  // ===< LIFECYCLE >===
  // 
  /**
   * componentDidMount
   */
  componentDidMount = () => {
    this.fetchData();
  }
  /**
   * componentDidUpdate
   */
  componentDidUpdate = (prevProps: StocksPageProps, prevState: StocksPageState) => {
    const { filter } = this.state;
    if (prevState.filter !== filter) {
      this.fetchData();
    }
  }
  /**
   * componentWillUnmount
   */
  componentWillUnmount = () => {
    this.mounted = false;
  }


  // ===< EVENT HANDLERS >===
  // 
  onClickAddStockHandler = () => {
    const { history } = this.props;
    history.push('/editStock');
  }
  /**
   * Occurs when the filter on the page changed
   * 
   * @param filter - the installable filter
   */
  onChangeFilterHandler = (filter: StockGroupFilterOperations) => {
    this.setState({ filter });
    // All stocks
    if (filter === StockGroupFilterOperations.ALL) {
      this.props.history.push('/stocks')
    // "Bluetip" stocks
    } else if (filter === StockGroupFilterOperations.BLUETIPS) {
      this.props.history.push('/stocks?bluetip=true')
    }
  }


  // ===< UTILS >===
  // 
  /**
   * This page can be loaded with query params (now just with param "bluetip" or without it).
   * This func returns the filter considering query params.
   * This func is used just in constructor, defining an initial filter
   */
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
  /**
   * Get stocks from a server
   */
  fetchData = (): void => {

    const { fetchStocks } = this.props;
    const { filter } = this.state;
    // Is it needed to get bluetips?
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
  /**
   * Renders main content of this page
   */
  renderContent = (): React.ReactNode => {
    const { stocks } = this.props;
    const { loading } = this.state;

    if (loading) {
      return <Loader />;

    } else {
      return <StocksBoard stocks={stocks} />;
    }
  }


  // ===< RENDER >===
  // 
  render() {
    const { isAdmin, stocks } = this.props;
    const { hasError, filter } = this.state;

    // The component has an error
    if (hasError) {
      throw new Error('An error occurred while fetching stocks.');
    }

    // Main content
    return (
      <MainContainer>

        <h1>Акции</h1>
        {/* Filter */}
        <StockGroupFilter
          initialFilter={ filter }
          onChangeFilter={ this.onChangeFilterHandler }
        />

        {/* Render Stocks */}
        { this.renderContent() }
        
        {/* Add Stock button */}
        {isAdmin && (
          <FloatingButton
            iconName="add"
            isFixed={ true }
            onClick={ this.onClickAddStockHandler }
          />
        )}

      </MainContainer>
    );
  }
}

export default connector(StocksPage);

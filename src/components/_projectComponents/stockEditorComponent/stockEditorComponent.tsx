import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
// Custom components
import Card, { CardContent, CardActions, CardErrors } from '../../card';
import { Select } from '../../inputs';
import TextInput from '../textInput';
import Button from '../../button';
import Checkbox from '../../checkbox';
import NotificationWithTransfer from '../notiticationWithTransfer';
import CurrencyInput from '../currencyInput';
import Loader from '../../loader';
// Store
import { AppState } from '../../../store'
import { fetchSectors, saveStock, getStockById } from '../../../store/stocks/action';
import { ExtendedStock, EconomicSector } from '../../../types';
// Utils
import { getParamFromQueryParams } from '../../../utils/getQueryParams';
// Validations
import { ValidationsRuleType } from '../../../utils/inputChecker/validate';
import { required, nonZero } from '../../../utils/inputChecker/validators';
// CSS
import './stockEditorComponent.scss';


// DESCRIPTION:
// 
// This component allows to edit a stock (share). The stock can be new or existing.
// A page with the component can be opened with query params or without those.
// If params are empty we add a new stock, if there is "id" param, we edit an existing stock.
// 
// Before save the stock we must check that fields:
// - shortName
// - ticker
// - price
// are completed.
// If any from these ones aren't completed, a warning is issued.
// 
// The stock has the field "sectorId". It's an id of an economic sector from the table "EconomicSectors".
// 
// While the stock initializing the data about the stock and 
//  economic sectors is loading. If there were an error in time of loading,
//  a page with a component "ErrorIndicator" opens.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// MAP STATE
const mapState = (state: AppState) => {
  return {
    isAdmin: !!state.auth.user?.isAdmin
  }
}

// MAP DISPATCH
const mapDispatch = (dispatch: any) => {
  return {
    fetchSectors: () => dispatch(fetchSectors()),
    saveStock: (stock: ExtendedStock) => dispatch(saveStock(stock)),
    getStockById: (id: string) => dispatch(getStockById(id))
  }
}

// PROPS
const connector = connect(mapState, mapDispatch);
type StockEditorComponentProps = ConnectedProps<typeof connector>
  & RouteComponentProps;

// STATE
type StockEditorComponentState = {
  id: string,
  // The next states are fields of the stock:
  shortName: string,
  ticker: string,
  price: number,
  bluetip: boolean,
  sectorId: string,

  // It's also a field of the stock,
  //  but stores in an individual table,
  //  where an id of the stock is matching to an user
  isFavorite: boolean,

  // Whether the shortname is valid or not
  isShortNameValid: boolean,
  // 
  isTickerValid: boolean,
  // 
  isPriceValid: boolean,
  
  // Stores an array of econ. sectors.
  // ??? May be change to Array<EconomicSector>
  options: { id: string, name: string }[],
  // If the flag = "true", the stock is saved.
  //  Otherwise not saved
  done: boolean,
  // Loading while the component initializing
  startLoading: boolean,
  // Loading while a saving operation execution
  loading: boolean,
  // The flag = "true" if there is an error while
  //  the component initializing
  hasError: boolean,
  // An error decsription, occuring at a saving operation execution
  error: string,
  // The flag indicates that all fields must be validated
  //  regardless whether they is changed or not
  forceValidation: boolean
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class StockEditorComponent extends React.Component<StockEditorComponentProps, StockEditorComponentState> {

  // ===< CLASS FIELDS >===
  // 
  // This field stores the flag that DOM is rendered.
  // An user can start async operations and don't wait until they finished.
  // In that case leak memories have place.
  // 
  // So we use this field in async operations to not interact with the component,
  //  when DOM is already (or yet) not rendered
  private mounted: boolean = true;
  // These rules are used for check of the state "shortName"
  private shortNameValidations: ValidationsRuleType = {
    required: { rule: required, msg: `Поле 'Краткое наименование' не заполнено.` }
  };
  // These rules are used for check of the state "ticker"
  private tickerValidations: ValidationsRuleType = {
    required: { rule: required, msg: `Поле 'Тикер' не заполнено.` }
  }
  // These rules are used for check of the state "price"
  private priceValidations: ValidationsRuleType = {
    required: { rule: nonZero, msg: `Поле 'Цена' не заполнено.` }
  }


  // ===< STATE >===
  // 
  state = {
    id: '',
    // shortName
    shortName: '',
    isShortNameValid: true,
    // ticker
    ticker: '',
    isTickerValid: true,
    // price
    price: 0,
    isPriceValid: true,

    bluetip: false,
    sectorId: '',
    isFavorite: false,
    options: [],
    done: false,
    // done: true,
    startLoading: true,
    loading: false,
    hasError: false,
    error: '',
    forceValidation: false
  }


  // ===< LIFECYCLE >===
  // 
  /**
   * componentDidMount
   */
  componentDidMount = () => {
    this.mounted = true;
    // Get actions from the props
    const { fetchSectors, getStockById } = this.props;
    // Do an array of promises:
    //  - get economic sectors
    //  - get a stock, if the id got from the props isn't empty
    const promisesForExecution = [fetchSectors()];
    const id = this.getId();
    if (id) {
      promisesForExecution.push(getStockById(id));
    }
    // We need all promises were valid,
    //  so use Promise.all()
    Promise.all(promisesForExecution)
      .then(
        values => {
          // The first value is an array of econ. sectors
          const sectors = values[0];
          let stock = new ExtendedStock();
          // If there is the second value,
          //  it's a stock
          if (values[1]) {
            stock = values[1];
          }
          // Get data from the stock.
          //  If the stock is empty, assign default values
          const { id = '', shortName = '', ticker = '', price = 0, bluetip = false, isFavorite = false, sector: { id: sectorId = '' } } = stock;
          // Set state
          this.setState({ id, shortName, ticker, price, bluetip, sectorId, isFavorite, options: sectors });
          
        }
      )
      .catch(
        () => { this.mounted && this.setState({ hasError: true }) }
      )
      .finally(
        () => { this.mounted && this.setState({ startLoading: false }) }
      )
  }
  /**
   * componentWillUnmount
   */
  componentWillUnmount = () => {
    this.mounted = false;
  }


  // ===< EVENT HANDLERS >===
  // 
  // => ShortName - "onChange"
  onChangeCompanyShortNameHandler = (data: string, valid: boolean) => {
    this.setState({
      shortName: data,
      isShortNameValid: valid
    });
  }
  // => ShortName - "onPressEnter"
  onPressEnterCompanyShortNameHandler = () => {
    this.doSave();
  }
  // => Ticker - "onChange"
  onChangeTickerHandler = (data: string, valid: boolean) => {
    this.setState({
      ticker: data,
      isTickerValid: valid
    });
  }
  // => Ticker - "onPressEnter"
  onPressEnterTickerHandler = () => {
    this.doSave();
  }
  // => Price - "onChange"
  onChangePriceHandler = (data: number, valid: boolean) => {
    this.setState({ price: data, isPriceValid: valid });
  }
  // => Price - "onPressEnter"
  onPressEnterPriceHandler = () => {
    this.doSave();
  }
  // => BlueTip - "onChange"
  onChangeBlueTipHandler = () => {
    this.setState((state) => {
      return {
        bluetip: !state.bluetip
      }
    })
  }
  // => Sector - "onChange"
  onChangeSectorHandler = (data: string) => {
    if (data) {
      this.setState({ sectorId: data });
    }
  }
  // => btn "Save" - "onClick"
  onClickSaveHandler = () => {
    this.doSave();
  }


  // ===< UTILS >===
  // 
  /**
   * The function returns id from the query params or an empty string.
   */
  getId = (): string => {
    const { location } = this.props;
    return getParamFromQueryParams(location.search, 'id');
  }
  /**
   * Returns "true", if all verifiable fields are completed,
   *  otherwise "false"
   */
  hasData = (): boolean => {
    const { shortName, ticker, price } = this.state;
    return !!shortName.trim() && !!ticker.trim() && !!price;
  }
  /**
   * Returns "true", if all verifiable fields are valid,
   *  otherwise "false"
   */
  isValid = (): boolean => {
    const { isShortNameValid, isTickerValid, isPriceValid } = this.state;
    return isShortNameValid && isTickerValid && isPriceValid;
  }
  /**
   * Does the async operation "save";
   *  save the stock
   */
  doSave = async () => {
    // all fields must be completed
    if (!this.hasData()) {
      this.setState({ forceValidation: true });
      return;
    }
    // all fields must be valid
    if (!this.isValid()) {
      return;
    }
    // if all is correct, do login
    const {
      id,
      price,
      shortName,
      ticker,
      bluetip,
      sectorId,
      isFavorite
    } = this.state;
    const { saveStock } = this.props;

    // create a sector object
    const sector: EconomicSector = new EconomicSector();
    sector.init(
      sectorId, // id
      '' // name
    );

    // create a stock object
    const stock: ExtendedStock = new ExtendedStock();
    stock.init(
      id, // id
      ticker, // ticker
      shortName, // shortName
      price, // price
      sector, // sector
      bluetip, // bluetip,
      isFavorite // isFavorite
    );

    this.setState({ loading: true });
    try {
      await saveStock(stock);
      this.mounted && this.setState({ done: true });
    } catch (err) {
      this.mounted && this.setState({ error: err.message });
    } finally {
      this.mounted && this.setState({ loading: false });
    }
  }


  // ===< RENDER >===
  // 
  render() {

    // Destructure state
    const {
      price,
      shortName,
      ticker,
      bluetip,
      sectorId,
      options,
      done,
      hasError,
      forceValidation,
      startLoading,
      loading,
      error
    } = this.state;

    // If we have an error, throw an exception
    if (hasError) {
      throw new Error();
    }
    // If the component is initializing,
    //  display <Loader>
    if (startLoading) {
      return <Loader />;
    }
    // If the stock is saved,
    //  return a notification
    if (done) {
      return (
        <NotificationWithTransfer
          header="Акция сохранена"
          text="Сохранение акции выполнено успешно!"
          path="/stocks"
          pathText="Акции"
        />
      );
    }

    // Main content
    return (
      <Card>
        {/* CONTENT */}
        <CardContent>
          {/* ShortName */}
          <TextInput
            id="companyShortName"
            label="Краткое наименование компании"
            type="text"
            value={shortName}
            forceValidation={forceValidation}
            validate={true}
            validations={this.shortNameValidations}
            onChange={this.onChangeCompanyShortNameHandler}
            onPressEnter={this.onPressEnterCompanyShortNameHandler}
          />
          {/* Ticker */}
          <TextInput
            id="ticker"
            label="Тикер"
            type="text"
            value={ticker}
            forceValidation={forceValidation}
            validate={true}
            validations={this.tickerValidations}
            onChange={this.onChangeTickerHandler}
            onPressEnter={this.onPressEnterTickerHandler}
          />
          {/* Price */}
          <CurrencyInput
            id="price"
            label="Цена"
            value={price}
            touched={forceValidation}
            validate={true}
            validations={this.priceValidations}
            onChange={this.onChangePriceHandler}
            onPressEnter={this.onPressEnterPriceHandler}
          />
          {/* BlueTip */}
          <Checkbox
            id="bluetip"
            value={bluetip}
            text={`"Голубая фишка"`}
            onChange={this.onChangeBlueTipHandler}
          />
          {/* Sector */}
          <Select
            id="selectSector"
            label="Отрасль"
            value={sectorId}
            options={options}
            listHeader="Выберите отрасль ..."
            onChange={this.onChangeSectorHandler}
          />
        </CardContent>
        
        {/* ACTION */}
        <CardActions position="left">
          <Button
            text="Сохранить"
            iconName="send"
            disabled={loading}
            onClick={this.onClickSaveHandler}
          />
        </CardActions>

        {/* ERRORS */}
        <CardErrors>
          { error }
        </CardErrors>
        
      </Card>
    );
  }
}

export default connector(
  withRouter(
    StockEditorComponent
  )
);

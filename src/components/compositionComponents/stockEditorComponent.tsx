////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
// import 
// import custom components
import Card from '../card';
import { Select } from '../inputs';
import TextInput from './textInput';
import Button from '../button';
import Checkbox from '../checkbox';
import NotificationWithTransfer from '../notiticationWithTransfer';
import CurrencyInput from './currencyInput';
import Loader from '../spinner';
// import store
import { AppState } from '../../store'
import { fetchSectors, saveStock } from '../../store/stocks/action';
import { ExtendedStock, EconomicSector } from '../../types';
// import utils
import { getQueryParams } from '../../utils/getQueryParams';
// import store
import { getStockById } from '../../store/stocks/action';
// 
import { ValidationsRuleType } from '../../utils/inputChecker/validate';
import { required, nonZero } from '../../utils/inputChecker/validators';


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

// type Props
type StockEditorComponentExtraProps = {
  // stock?: ExtendedStock
}
const connector = connect(mapState, mapDispatch);
type StockEditorComponentProps = ConnectedProps<typeof connector>
  & StockEditorComponentExtraProps
  & RouteComponentProps;

// type State
type StockEditorComponentState = {
  id: string,
  // shortName
  shortName: string,
  isShortNameValid: boolean,
  // ticker
  ticker: string,
  isTickerValid: boolean,
  // price
  price: number,
  isPriceValid: boolean,

  bluetip: boolean,
  sectorId: string,
  isFavorite: boolean,
  options: { id: string, name: string }[],
  done: boolean,
  startLoading: boolean, // loading at the page opening
  loading: boolean, // loading at an operation execution
  hasError: boolean, // flag, if there is an error at the page opening
  error: string, // error decsription, occuring at an operation execution
  touched: boolean
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class StockEditorComponent extends React.Component<StockEditorComponentProps, StockEditorComponentState> {

  private mounted: boolean = true;
  private shortNameValidations: ValidationsRuleType = {
    required: { rule: required, msg: `Поле 'Краткое наименование' не заполнено.` }
  };
  private tickerValidations: ValidationsRuleType = {
    required: { rule: required, msg: `Поле 'Тикер' не заполнено.` }
  }
  private priceValidations: ValidationsRuleType = {
    required: { rule: nonZero, msg: `Поле 'Цена' не заполнено.` }
  }

  // STATE
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
    startLoading: true,
    loading: false,
    hasError: false,
    error: '',
    touched: false
  }

  // LIFECYCLE
  componentDidMount = () => {
    this.mounted = true;

    const { fetchSectors, getStockById } = this.props;
    
    const promisesForExecution = [fetchSectors()];
    const id = this.getId();
    if (id) {
      promisesForExecution.push(getStockById(id));
    }

    Promise.all(promisesForExecution)
      .then(
        values => {
          const sectors = values[0];
          let stock = new ExtendedStock();
          if (values[1]) {
            stock = values[1];
          }
          const { id = '', shortName = '', ticker = '', price = 0, bluetip = false, isFavorite = false, sector: { id: sectorId = '' } } = stock;
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
  componentWillUnmount = () => {
    this.mounted = false;
  }

  // EVENT HANDLERS
  onChangeCompanyShortNameHandler = (data: string, valid: boolean) => {
    this.setState({
      shortName: data,
      isShortNameValid: valid
    });
  }
  onPressEnterCompanyShortNameHandler = () => {
    this.doSave();
  }
  onChangeTickerHandler = (data: string, valid: boolean) => {
    this.setState({
      ticker: data,
      isTickerValid: valid
    });
  }
  onPressEnterTickerHandler = () => {
    this.doSave();
  }
  onChangeBlueTipHandler = () => {
    this.setState((state) => {
      return {
        bluetip: !state.bluetip
      }
    })
  }
  onChangeSectorHandler = (data: string) => {
    if (data) {
      this.setState({ sectorId: data });
    }
  }
  onChangePriceHandler = (data: number, valid: boolean) => {
    this.setState({ price: data, isPriceValid: valid });
  }
  onPressEnterPriceHandler = () => {
    this.doSave();
  }
  onClickSaveHandler = () => {
    this.doSave();
  }

  // UTILS
  getId = (): string => {
    // get id from query params
    const { location } = this.props;
    const params = getQueryParams(location.search);
    return ("id" in params) ? params.id : '';
  }
  hasData = (): boolean => {
    const { shortName, ticker, price } = this.state;
    return !!shortName.trim() && !!ticker.trim() && !!price;
  }
  isValid = (): boolean => {
    const { isShortNameValid, isTickerValid, isPriceValid } = this.state;
    return isShortNameValid && isTickerValid && isPriceValid;
  }
  doSave = async () => {
    // all fields must be completed
    if (!this.hasData()) {
      this.setState({ touched: true });
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

    const sector: EconomicSector = new EconomicSector();
    sector.init(
      sectorId, // id
      '' // name
    );

    // create stock object
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

  // RENDER
  render() {

    // destructure state
    const {
      price,
      shortName,
      ticker,
      bluetip,
      sectorId,
      options,
      done,
      hasError,
      touched,
      startLoading,
      loading,
      error
    } = this.state;

    // if have an error, throw an exception
    if (hasError) {
      throw new Error();
    }

    if (startLoading) {
      return <Loader />;
    }

    // if stock is saved,
    // return notification
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

    // define btn "Save"
    const btnSave = <Button
      text="Сохранить"
      disabled={loading}
      onClick={this.onClickSaveHandler}
    />;

    // Main content
    return (
        <Card
          actionContent={btnSave}
          error={error}
        >
          <TextInput
            id="companyShortName"
            label="Краткое наименование компании"
            type="text"
            value={shortName}
            touched={touched}
            validate={true}
            validations={this.shortNameValidations}
            onChange={this.onChangeCompanyShortNameHandler}
            onPressEnter={this.onPressEnterCompanyShortNameHandler}
          />
          <TextInput
            id="ticker"
            label="Тикер"
            type="text"
            value={ticker}
            touched={touched}
            validate={true}
            validations={this.tickerValidations}
            onChange={this.onChangeTickerHandler}
            onPressEnter={this.onPressEnterTickerHandler}
          />
          <CurrencyInput
            id="price"
            label="Цена"
            value={price}
            touched={touched}
            validate={true}
            validations={this.priceValidations}
            onChange={this.onChangePriceHandler}
            onPressEnter={this.onPressEnterPriceHandler}
          />
          <Checkbox
            id="bluetip"
            value={bluetip}
            text={`"Голубая фишка"`}
            onChange={this.onChangeBlueTipHandler}
          />
          <Select
            id="selectSector"
            label="Отрасль"
            value={sectorId}
            options={options}
            listHeader="Выберите отрасль ..."
            onChange={this.onChangeSectorHandler}
          />
          
        </Card>
    );
  }
}

export default connector(
  withRouter(
    StockEditorComponent
  )
);

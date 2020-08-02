import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// store
import { setStockFavorite } from '../../store/stocks/action';
// custom components
import Spinner from '../circleSpinner';
// context
import { StockContext } from './stockCard';
// types
import { ExtendedStock } from '../../types';
// import svg
import transparentStarSvg from '../../assets/svg/favorite.svg';
import yellowStarSvg from '../../assets/svg/favorite-yellow.svg';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

const mapDispatch = (dispatch: any) => {
  return {
    setFavorite: (stock: ExtendedStock): Promise<void> => dispatch(setStockFavorite(stock))
  }
}

const connector = connect(null, mapDispatch);
type AddFavoriteProps = ConnectedProps<typeof connector>;


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const AddFavorite = (props: AddFavoriteProps) => {

  // loading = executing adding a stock to favorite
  const [ loading, setLoading ] = useState(false);
  // if there is a loading, return spinner
  if (loading) {
    return <Spinner />;
  }


  // EVENT HANDLERS
  const onClickHandler = async (stock: ExtendedStock) => {
    // get action from props
    const { setFavorite } = props;

    setLoading(true);
    // timeout is dummy.
    // emulate a delay while excuting a network request.
    // 
    // when "setFavorite" will be realized,
    // it's necessary to delete setTimeout
    const timeId = setTimeout(() => {
      setFavorite(stock)
        .finally(() => {
          setLoading(false);
          clearTimeout(timeId);
        });
    }, 2000);
  }


  // UTILS
  /**
   * returns an empty start or a yellow star (svg). It depends on the "isFavorite" property
   * 
   * @param {ExtendedStock} stock - a stock, which the star is rendered for
   */
  const renderStar = (stock: ExtendedStock) => {
    const { isFavorite } = stock;
    // define, which star to render
    const starSvg = isFavorite ? yellowStarSvg : transparentStarSvg;
    // 
    return (
      <img
        src={ starSvg }
        alt=''
        onClick={ () => onClickHandler(stock) }
      />
    );
  }


  // RENDER
  return (
    <StockContext.Consumer>
      { (stock: ExtendedStock) => renderStar(stock) }
    </StockContext.Consumer>
  );
}

export default connector(AddFavorite);

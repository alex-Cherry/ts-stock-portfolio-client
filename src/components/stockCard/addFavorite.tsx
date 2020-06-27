import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Spinner from '../circleSpinner';
import { StockContext } from './stockCard';
// import svg
import starSvg from '../../assets/svg/favorite.svg';
import yellowStarSvg from '../../assets/svg/favorite-yellow.svg';
import { ExtendedStock } from '../../types';
import { setStockFavorite } from '../../store/stocks/action';


const mapDispatch = (dispatch: any) => {
  return {
    setFavorite: (stock: ExtendedStock) => dispatch(setStockFavorite(stock))
  }
}

const connector = connect(null, mapDispatch);
type AddFavoriteProps = ConnectedProps<typeof connector>;

const AddFavorite = (props: AddFavoriteProps) => {

  const [ loading, setLoading ] = useState(false);
  if (loading) {
    return <Spinner />;
  }

  const onClickHandler = (stock: ExtendedStock) => {

    const { setFavorite } = props;

    setLoading(true);
    const timeId = setTimeout(() => {
      setFavorite(stock);
      setLoading(false);
      clearTimeout(timeId);
    }, 2000);
  }

  const getStarSvg = (stock: ExtendedStock) => {
    const { isFavorite } = stock;
    return isFavorite ? yellowStarSvg : starSvg
  }

  // RENDER
  return (
    <StockContext.Consumer>
      { (stock: ExtendedStock) => (
          <img
            src={getStarSvg(stock)}
            alt=''
            onClick={() => onClickHandler(stock)}
          />
      ) }
    </StockContext.Consumer>
  );
}

export default connector(AddFavorite);

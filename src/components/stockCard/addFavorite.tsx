import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
// store
import { setStockFavorite } from '../../store/stocks/action';
import { AppState } from '../../store';
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

// MAP STATE
const mapState = (state: AppState) => {
  return {
    isLoggedIn: !!state.auth.user
  }
}

// MAP DISPATCH
const mapDispatch = (dispatch: any) => {
  return {
    setFavorite: (stock: ExtendedStock): Promise<void> => dispatch(setStockFavorite(stock))
  }
}

// PROPS
const connector = connect(mapState, mapDispatch);
type AddFavoriteProps = ConnectedProps<typeof connector>;


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const AddFavorite = (props: AddFavoriteProps) => {

  // ===< STATE >===
  // 
  // This flag indicates that adding a stock to favorite is executing
  const [ loading, setLoading ] = useState(false);

  // If there is loading, render the spinner
  if (loading) {
    return <Spinner />;
  }


  // ===< EVENT HANDLERS >===
  // 
  const onClickHandler = async (stock: ExtendedStock) => {
    // Get the action from the props
    const { setFavorite } = props;

    setLoading(true);
    // Timeout is dummy.
    // Emulate a delay while excuting a network request.
    // 
    // When "setFavorite" will be realized,
    //  it's necessary to delete setTimeout
    const timeId = setTimeout(() => {
      setFavorite(stock)
        .finally(() => {
          setLoading(false);
          clearTimeout(timeId);
        });
    }, 2000);
  }


  // ===< UTILS >===
  // 
  /**
   * Returns an empty star or a yellow star (svg). 
   * It depends on the "isFavorite" property
   * 
   * @param {ExtendedStock} stock - the stock, which the star is rendered for
   */
  const renderStar = (stock: ExtendedStock) => {
    // 
    const { isLoggedIn } = props;

    // Return nothing
    if (!isLoggedIn) {
      return null;
    }

    const { isFavorite } = stock;
    // Define, which star to render
    const starSvg = isFavorite ? yellowStarSvg : transparentStarSvg;
    // 
    return (
      <div className="stock-card__favorite-star">
        <img
          src={ starSvg }
          alt=''
          onClick={ () => onClickHandler(stock) }
        />
      </div>
    );
  }


  // ===< RENDER >===
  // 
  return (
    <StockContext.Consumer>
      { (stock: ExtendedStock) => renderStar(stock) }
    </StockContext.Consumer>
  );
}

export default connector(AddFavorite);

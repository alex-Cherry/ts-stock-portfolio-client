import React, { useState } from 'react';
import Spinner from '../circleSpinner';
import { StockContext } from './stockCard';
// import svg
import starSvg from '../../assets/svg/favorite.svg';
import yellowStarSvg from '../../assets/svg/favorite-yellow.svg';


type AddFavoriteProps= {
  active?: boolean,
  onClick?: () => void
};

const AddFavorite = (props: AddFavoriteProps) => {

  const [ loading, setLoading ] = useState(false);
  if (loading) {
    return <Spinner />;
  }

  const {
    active = false,
    onClick = () => {}
  } = props;

  const onClickHandler = () => {
    setLoading(true);
    const timeId = setTimeout(() => {
      onClick();
      setLoading(false);
      clearTimeout(timeId);
    }, 2000);
  }

  const svg = active ? yellowStarSvg : starSvg;

  // RENDER
  return (
    <StockContext.Consumer>
      { (stock) => (
          <img
            src={svg}
            alt=''
            onClick={onClickHandler}
          />
      ) }
    </StockContext.Consumer>
  );
}

export default AddFavorite;

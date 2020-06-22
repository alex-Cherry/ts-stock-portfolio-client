import React from 'react';
// import utils
import { ElementRef } from '../../utils/checkClassesForRefObjects';
// import svg
import starSvg from '../../assets/svg/favorite.svg';
import yellowStarSvg from '../../assets/svg/favorite-yellow.svg';


type AddFavoriteProps= {
  elementRef: ElementRef<HTMLDivElement>,
  loading?: boolean,
  active?: boolean,
  onClick?: () => void
};

const AddFavorite = (props: AddFavoriteProps) => {

  const {
    elementRef,
    loading = false,
    active = false,
    onClick = () => {}
  } = props;

  const svg = active ? yellowStarSvg : starSvg;

  let content = <div className="favorite-loader"></div>;
  if (!loading) {
    content = (
      <img
        src={svg}
        alt=''
        onClick={onClick}
      />
    );
  }

  
  // RENDER
  return (
    <div
      ref={elementRef}
      className="stock-card-favorite"
    >
      { content }
    </div>
  );
}

export default AddFavorite;

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
// Custom components
import MainContainer from '../../components/_projectComponents/mainContainer';
import Button from '../../components/button';
// Image
import notFoundImg from '../../assets/images/404.png';
// CSS
import './notFoundPage.scss';


// DESCRIPTION:
// 
// This is a page where an user is redirected if he entered the wrong address
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type NotFoundPageProps = RouteComponentProps;


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const NotFoundPage = (props: NotFoundPageProps) => {

  // ===< EVENT HANDLERS >===
  // 
  const onClickHandler = () => {
    const { history: { push } } = props;
    push('/');
  }


  // ===< RENDER >===
  // 
  return (
    <MainContainer>
      <div className="not-found">
        {/* img */}
        <img className="not-found__img" src={ notFoundImg } alt="" />
        {/* btn "to the Main page" */}
        <Button
          text="На главную"
          className="not-found__btn-main"
          onClick={ onClickHandler }
        />
      </div>
    </MainContainer>
    
  );
}

export default NotFoundPage;

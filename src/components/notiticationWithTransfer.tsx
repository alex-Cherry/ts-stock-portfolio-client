////////////////////////////////////////////////////////////////////////////////
// 
// IMPORT
// 
////////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
// import custom components
import Card from './card';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type NotificationWithTransferProps = {
  seconds?: number,
  header: string,
  text: string,
  path: string,
  pathText: string
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const NotificationWithTransfer = (props: NotificationWithTransferProps) => {

  const { seconds = 5 } = props;
  const [time, setTime] = useState(seconds);

  // turn on timer
  useEffect(() => {
    if (time === 0) {
      return;
    }

    const timeId = setTimeout(() => {
      setTime(state => state - 1)
    }, 1000);

    return () => {
      clearTimeout(timeId);
    }
  }, [time]);

  const {
    header,
    text,
    path,
    pathText
  } = props;

  // if time's over, redirect to page on path
  if (!time) {
    return <Redirect to={path} />;
  }

  return (
    <Card>
      <h3>{header}</h3>
      <p>{text}</p>
      <p>Переход на страницу <Link to={path}>{pathText}</Link> будет выполнен через {time} секунд.</p>
    </Card>
  );

}

export default NotificationWithTransfer;

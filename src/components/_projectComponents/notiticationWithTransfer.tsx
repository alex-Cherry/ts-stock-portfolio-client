import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
// custom components
import Card, { CardHeader, CardContent } from '../card';


// DESCRIPTION:
// 
// This component is an info component.
// It contains a notification about a completed action before transfering to another page.
//  The description of this action is defined in the corresponding property.
//  The target page is defined with two properties: "path" and "pathText".
// 
// This component also displays the time remaining before transfering to the target page.
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type NotificationWithTransferProps = {
  // The header of the notification
  header: string,
  // The description of the notification
  text: string,
  // The path, where transfer will be on
  path: string,
  // Representation of the path 
  pathText: string,
  // Time (in seconds) left before transfering to the target page
  seconds?: number
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

const NotificationWithTransfer = (props: NotificationWithTransferProps) => {

  // ===< PROPS >===
  // 
  const {
    seconds = 5, // Default value of seconds = 5
    header,
    text,
    path,
    pathText
  } = props;


  // ===< STATE >===
  // 
  // Stores time left to transfer to the page specialized in the props
  const [ time, setTime ] = useState(seconds);


  // ===< HOOKS >===
  // 
  // Turn on timer
  useEffect(() => {
    if (time === 0) {
      return;
    }

    // Decrease time on one value
    //  after one second
    const timeId = setTimeout(() => {
      setTime(state => state - 1)
    }, 1000);

    return () => {
      clearTimeout(timeId);
    }
  }, [ time ]);


  // If the time's over, redirect to the page on path
  if (!time) {
    return <Redirect to={ path } />;
  }


  // ===< RENDER >===
  // 
  return (
    <Card>

      {/* Header */}
      <CardHeader>
        { header }
      </CardHeader>

      {/* Content */}
      <CardContent>
        { text }
        <br />
        Переход на страницу <Link to={ path} >{ pathText }</Link> будет выполнен через { time } секунд.
      </CardContent>

    </Card>
  );

}

export default NotificationWithTransfer;

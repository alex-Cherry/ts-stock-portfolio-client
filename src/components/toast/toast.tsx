import React, { useState, useEffect, CSSProperties } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { Toast } from '../../store/toasts/types';
import { removeToast } from '../../store/toasts/actions';

const mapDispatch = (dispatch: any) => {
  return {
    removeToast: (id: string) => dispatch(removeToast(id))
  };
}

const connector = connect(null, mapDispatch);

type ToastProps = {
  toast: Toast,
  timeIn: number,
  timeOut: number,
  duration: number
} & ConnectedProps<typeof connector>;

const ToastElement = (props: ToastProps) => {

  // destructure props
  const {
    duration,
    timeIn,
    timeOut,
    toast: { id, text },
    removeToast
  } = props;
  // 
  const [ active, setActive ] = useState(true);
  const [ removed, setRemoved ] = useState(false);

  // 
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      setActive(false);
      // setRemoved(true);
    }, duration);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [duration, id]);

  // 
  useEffect(() => {
    if (active) {
      return;
    }
    const timeOutId = setTimeout(() => {
      setRemoved(true);
      
    }, timeOut);
    // clear resources
    return () => {
      clearTimeout(timeOutId);
    };
  }, [active, timeOut, id, setRemoved, removeToast]);

  // 
  useEffect(() => {
    if (!removed) {
      return;
    }
    setTimeout(() => {
      removeToast(id);
      
    }, 3000);
    // removeToast(id);
  }, [removed, id, removeToast]);

  const onClickCloseHandler = () => {
    setActive(false);
  }

  if (removed) {
    console.log('here')
    return null;
  }

  // define classes and style for an element
  const classes = ['toast'];
  const style: CSSProperties = {
    animationDuration: `0`,
    transitionProperty: 'none',
    transitionDuration: '0s'
  };
  if (!active) {
    classes.push('toast-out');
    style.animationDuration = `${timeOut/1000}s`;
    style.transitionProperty = `all`;
    style.transitionDuration = `0.5s`;
  } else {
    classes.push('toast-slide');
    style.animationDuration = `${timeIn/1000}s`;
  }

  console.log('here1')
  // RENDER
  return (
    <div
      className={classes.join(' ')}
      style={style}
    >
      <div
        className="toast-times"
        onClick={onClickCloseHandler}
      >
        &times;
      </div>
      <div className="toast-text"> { text } </div>
    </div>
  );
}

export default connector(ToastElement);

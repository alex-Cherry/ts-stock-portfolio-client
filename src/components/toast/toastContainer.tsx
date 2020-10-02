import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { AppState } from '../../store';
// import { addToast } from '../../store/toasts/actions';
// import ToastElement from './toast';
import ToastElement from './toastClass';
import { Toast } from '../../store/toasts/types';

import './toast.scss';

// DISPATCH
const mapState = (state: AppState) => {
  return {
    toasts: state.toasts.toasts
  }
}

const connector = connect(mapState);
type ToastContainerProps = ConnectedProps<typeof connector>
  // & RouteComponentProps
  & {
    timeIn?: number,
    timeOut?: number,
    duration?: number
  };

const ToastContainer = (props: ToastContainerProps) => {

  const {
    toasts,
    duration = 5000,
    timeIn = 200,
    timeOut = 300
  } = props;

  return (
    <div
      className="toast-container"
    >
      {
        toasts.map((toast: Toast) => {
          return (
            <ToastElement
              key={toast.id}
              toast={toast}
              duration={duration}
              timeIn={timeIn}
              timeOut={timeOut}
            />
          );
        })
      }
    </div>
  );

}

export default connector(ToastContainer);

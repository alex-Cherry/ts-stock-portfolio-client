import React, { CSSProperties } from 'react';
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

type ToastState = {
  active: boolean,
  removed: boolean
};

class ToastElement extends React.Component<ToastProps, ToastState> {

  private timeDurationId = setTimeout(() => {}, 0);

  state = {
    active: true,
    removed: false
  };

  componentDidMount = () => {
    const {
      duration
    } = this.props;

    this.timeDurationId = setTimeout(() => {
      this.setState({ active: false });
    }, duration);
  }

  componentDidUpdate = (prevProps: ToastProps, prevState: ToastState) => {

    const { timeOut, removeToast } = this.props;

    if (prevState.active !== this.state.active) {
      
      this.timeDurationId = setTimeout(() => {
        // this.setState({ removed: true });
        removeToast(this.props.toast.id);
      }, timeOut);

    // } else if (prevState.removed !== this.state.removed) {
    //   removeToast(this.props.toast.id);
    }
  }

  componentWillUnmount = () => {
    clearTimeout(this.timeDurationId);
  }

  render() {

    const {
      active,
      removed
    } = this.state;

    // if (removed) {
    //   return null;
    // }

    // destructure props
    const {
      // duration,
      timeIn,
      timeOut,
      toast: { text },
      // removeToast
    } = this.props;

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

    return (
      <div
        className={classes.join(' ')}
        style={style}
      >
        <div
          className="toast-times"
          // onClick={onClickCloseHandler}
        >
          &times;
        </div>
        <div className="toast-text"> { text } </div>
      </div>
    );
  }
}

export default connector(ToastElement);

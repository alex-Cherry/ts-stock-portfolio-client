import React from 'react';
// Custom elements
import ToastElement from './toast';
// Store
import { Toast, ToastOptions, ToastAnimation } from './store/types';
import { store } from './store/ToastStore';
import { toast, activateToastContainer } from './store/toast';
// CSS
import './toast.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// PROPS
// The "ToastContainerProps" type has the same properties
//  as the "ToastOptions" type".
type ToastContainerProps = ToastOptions 

// STATE
type ToastContainerState = {
  toasts: Toast[]
};


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class ToastContainer extends React.Component<ToastContainerProps, ToastContainerState> {

  // ===< CLASS FIELDS >===
  // 
  // The component uses the values obtained during creation.
  //  I.e. changing of the component properties has no effect.
  //  So we use separate variables
  private timeIn = 0;
  private timeOut = 0;
  private duration = 0;
  private animation: ToastAnimation;


  // ===< CONSTRUCTOR >===
  // 
  constructor(props: ToastContainerProps) {
    super(props);

    // Initialize state
    this.state = {
      toasts: []
    };
    // Initialize the class variables
    this.duration = (typeof this.props.duration !== 'undefined')
      ? this.props.duration
      : 5000;
    this.timeIn = (typeof this.props.timeIn !== 'undefined')
      ? this.props.timeIn
      : 250;
    this.timeOut = (typeof this.props.timeOut !== 'undefined')
      ? this.props.timeOut
      : 300;
    this.animation = this.props.animation || 'Slide';
    // Activate this container
    activateToastContainer();
  }


  // ===< LIFE CYCLES >===
  // 
  /**
   * => componentDidMount()
   */
  componentDidMount = () => {
    // Register the method of the component
    //  in the global store
    store.subscribe(this.updateToasts);
  }
  /**
   * => componentWillUnmount()
   */
  componentWillUnmount = () => {
    // Unregister the method of the component
    //  in the global store
    store.unsubscribe(this.updateToasts);
  }


  // ===< EVENT HANDLERS >===
  // 
  onRemovedToastHandler = (toastId: string) => {
    toast.remove(toastId);
  }

  
  // ===< UTILS >===
  // 
  /**
   * => renderToasts()
   */
  renderToasts = () => {
    const { toasts } = this.state;

    return toasts.map((toast: Toast) => (
      <ToastElement
        key={ toast.id }
        text={ toast.text }
        duration={ this.duration }
        timeIn={ this.timeIn }
        timeOut={ this.timeOut }
        animation={ this.animation }
        options={ toast.options }
        // => Events
        onRemoved={ () => { this.onRemovedToastHandler(toast.id)} }
      />
    ));
  }
  /**
   * => updateToasts()
   */
  updateToasts = (toasts: Toast[]) => {
    this.setState({ toasts });
  }


  // ===< RENDER >===
  // 
  render = () => {
    return (
      <div className="toast-container">
        { this.renderToasts() }
      </div>
    );
  }

}

export default ToastContainer;

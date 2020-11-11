import React, { createRef } from 'react';
// Custom components
import SimpleTransition from './simpleAnimation';
import ProgressBar from '../progressBar';
// Store
import { ToastOptions, ToastAnimation } from './store/types';


// DESCRIPTION:
// 
// Here is the next algorithm:
// 1. When the component is created, we start the enter-animation.
// 2. When the enter-animation is done (SimpleTransition -> afterEnter),
//      we start the progress bar (the state "playProgressBar" = true).
// 3. When the progress bar is finished (ProgressBar -> onFinished),
//      we start the exit-animation (the state "active" = false).
// 4. When the exit-animation is done (SimpleTransition -> afterExit),
//      we collapse the toast.
// 5. After the toast is collapsed< we change the state "collapsed" to true.
// 
// 
// The progress bar can be paused, when an user moves the cursor to the toast
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// PROPS
type ToastProps = ToastOptions & {
  // The text of the toast
  text: string,
  // The additional options of the toast
  options?: ToastOptions,

  // => Events
  onRemoved?: () => void
};

// STATE
type ToastState = {
  // When the property = "true", the toast is visible
  active: boolean,
  // 
  collapsed: boolean,
  // The property determines whether the progress bar is active or not  
  playProgressBar: boolean
};


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class ToastElement extends React.Component<ToastProps, ToastState> {

  // ===< CLASS FIELDS >===
  // 
  private timer: NodeJS.Timeout | null = null;
  // The reference to the root element of the component.
  //  It's necessary to control the animation in the component "SimpleTransition"
  private toastRef: React.RefObject<HTMLDivElement> | null = null;
  // The component uses the values obtained during creation.
  //  I.e. changing of the component properties has no effect.
  //  So we use separate variables
  private timeIn = 0;
  private timeOut = 0;
  private duration = 0;
  private animation: ToastAnimation;


  // ===< STATE >===
  // 
  state = {
    active: true,
    collapsed: false,
    playProgressBar: false
  };

  constructor(props: ToastProps) {
    super(props);

    // Initialize refs
    this.toastRef = createRef<HTMLDivElement>();
    // Priority:
    //  0 - the settings in the options have the first priority
    //  1 - the settings that were set in the properties of the component "ToastContainer"
    //    have the second priority
    this.duration = (typeof this.props.options?.duration !== 'undefined')
      ? this.props.options?.duration
      : this.props.duration || 0;
    this.timeIn = (typeof this.props.options?.timeIn !== 'undefined')
      ? this.props.options?.timeIn
      : this.props.timeIn || 0;
    this.timeOut = (typeof this.props.options?.timeOut !== 'undefined')
      ? this.props.options?.timeOut
      : this.props.timeOut || 0;
    this.animation = this.props.options?.animation || this.props.animation || 'Slide';
  }


  // ===< LIFE CYCLES >===
  // 
  /**
   * => componentDidMount()
   */
  componentDidMount = () => {
  }
  /**
   * => componentDidUpdate()
   */
  componentDidUpdate = (prevProps: ToastProps, prevState: ToastState) => {
    const { onRemoved = () => {} } = this.props;

    if (prevState.collapsed !== this.state.collapsed && this.state.collapsed) {
      // Run the event from the props
      onRemoved();
    }
  }
  /**
   * => componentWillUnmount()
   */
  componentWillUnmount = () => {
    this.clearTimers();
  }


  // ===< EVENT HANDLERS >===
  // 
  /**
   * => onClickCloseHandler()
   */
  onClickCloseHandler = () => {
    this.setActive(false);
    this.setPlayProgressBar(false);
  }
  /**
   * => afterEnterToastHandler()
   */
  afterEnterToastHandler = () => {
    // Start the progress bar
    this.setPlayProgressBar(true);
  }
  /**
   * => afterExitToastHandler()
   */
  afterExitToastHandler = () => {
    this.collapseToast();
  }
  /**
   * => onMouseEnterToastHandler()
   */
  onMouseEnterToastHandler = () => {
    // Stop the progress bar
    this.setPlayProgressBar(false);
  }
  /**
   * => onMouseLeaveToastHandler()
   */
  onMouseLeaveToastHandler = () => {
    // Start the progress bar
    this.setPlayProgressBar(true);
  }
  /**
   * => onFinishedProgressBarHandler()
   */
  onFinishedProgressBarHandler = () => {
    this.setActive(false);
    this.setPlayProgressBar(false);
  }


  // ===< UTILS >===
  // 
  getClassesForAnimation = (): string | {} => {
    if (this.animation === 'Slide') {
      return 'toast-slide';

    } else if (this.animation === 'Zoom') {
      return 'toast-zoom'

    } else {
      return 'toast-opacity';

    }
  }
  /**
   * => clearTimers()
   */
  clearTimers = (): void => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  /**
   * => getDOMElement()
   */
  getDOMElement = (): HTMLDivElement | null => {
    if (!this.toastRef || !this.toastRef.current) {
      return null;
    }

    return this.toastRef.current;
  }
  /**
   * => collapseToast()
   * 
   * The function decreases the height of the toast smoothly.
   * This function is necessary to avoid discrete (or step) movements of the toasts
   *  when the toast is being removed  
   */
  collapseToast = (): void => {
    // Get the DOM-element
    const element = this.getDOMElement();
    if (!element) {
      return;
    }

    const height = element.scrollHeight;
    const style = element.style;

    // Use the method "requestAnimationFrame"
    //  to reset the height of the toast
    requestAnimationFrame(() => {
      style.minHeight = 'initial';
      style.height = height + 'px';
      style.transition = `all 300ms`;

      requestAnimationFrame(() => {
        style.height = '0';
        style.padding = '0';
        style.margin = '0';

        setTimeout(() => {
          this.setState({ collapsed: true });
        }, 300);
      });
    });
  }
  /**
   * => renderProgressBar()
   */
  renderProgressBar = (): React.ReactNode | null => {
    if (this.duration) {
      return (
        <ProgressBar
          play={ this.state.playProgressBar && this.state.active }
          duration={ this.duration }
          size="s"
          colorScheme="silver"
          path={ false }
          reverse
          className="toast__progress-bar"

          onFinished={ this.onFinishedProgressBarHandler }
        />
      );

    // If duration = 0
    } else {
      return null;
    }
  }
  /**
   * => setActive()
   * 
   * @param value 
   */
  setActive = (value: boolean): void => {
    this.setState({ active: value });
  }
  /**
   * => setPlayProgressBar()
   * 
   * @param value 
   */
  setPlayProgressBar = (value: boolean): void => {
    // We change the state of the prograss bar
    //  only when we display this progress bar
    if (this.duration) {
      this.setState({ playProgressBar: value });
    }
  }


  // ===< RENDER >===
  // 
  render() {
    // Props
    const {
      text
    } = this.props;
    // State
    const {
      active,
      collapsed
    } = this.state;

    if (collapsed) {
      return null;
    }

    return (
      <SimpleTransition
        active={ active }
        timeout={{
          enter: this.timeIn,
          exit: this.timeOut
        }}
        nodeRef={ this.toastRef }
        classes={ this.getClassesForAnimation() }
        appear

        afterEnter={ this.afterEnterToastHandler }
        afterExit={ this.afterExitToastHandler }
      >
       
        <div
          className="toast"
          ref={ this.toastRef }
          onMouseEnter={ this.onMouseEnterToastHandler }
          onMouseLeave={ this.onMouseLeaveToastHandler }
        >

          {/* Times */}
          <div
            className="toast__times"
            onClick={ this.onClickCloseHandler }
          >
            &times;
          </div>

          {/* Text */}
          <div className="toast__text">
            { text }
          </div>

          {/* ProgressBar */}
          { this.renderProgressBar() }

        </div>
      </SimpleTransition>
    );
  }
}

export default ToastElement;

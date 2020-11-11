import React from 'react';
// Utils
import { setClass, removeClass } from '../../../utils/checkClassesForRefObjects';

// type SimpleTransitionRef<T extends HTMLElement> = RefObject<T> | MutableRefObject<T>;

type SimpleAnimationProps = {
  children: React.ReactNode,
  nodeRef: any,
  timeout: number | { enter?: number, exit?: number },
  active: boolean,
  classes: string | { 
    enter?: string,
    exit?: string,
  },
  appear?: boolean,

  // => Events
  beforeEnter?: () => void,
  afterEnter?: () => void,
  beforeExit?: () => void,
  afterExit?: () => void
}


class SimpleAnimation extends React.Component<SimpleAnimationProps> {
  
  // Timeout
  private timer: NodeJS.Timeout | null = null;
  // Time
  private timeIn = 0;
  private timeOut = 0;
  // Classes
  private classEnter = '';
  private classExit = '';


  // ===< CONSTRUCTOR >===
  // 
  constructor(props: SimpleAnimationProps) {
    super(props);

    // Initialize time-variables
    const timeout = this.props.timeout;
    if (typeof timeout === 'object') {
      this.timeIn = timeout.enter || 0;
      this.timeOut = timeout.exit || 0;

    } else if (typeof timeout === 'number') {
      this.timeIn = this.timeOut = timeout;

    } else {
      throw new Error(`The property 'timeout' has an unacceptable format.`);

    }

    // Initialize classes-variables
    const classes = this.props.classes;
    if (typeof classes === 'object') {
      this.classEnter = classes.enter || '';
      this.classExit = classes.exit || '';

    } else if (typeof classes === 'string') {
      this.classEnter = `${classes}-enter`;
      this.classExit = `${classes}-exit`;

    } else {
      throw new Error(`The property 'classes' has an unacceptable format.`);

    }
  }


  // ===< LIFE CYCLES >===
  // 
  componentDidMount = () => {
    if (this.props.appear && this.props.active) {
      this.enter();
    }
  }
  componentDidUpdate = (prevProps: SimpleAnimationProps) => {
    // 
    const { active } = this.props;

    if (prevProps.active !== active) {
      if (!active) {
        this.exit();
      } else if (active) {
        this.enter();
      }
    }
  }
  componentWillUnmount = () => {
    this.clearTimers();
  }


  // ===< UTILS >===
  // 
  /**
   * => getDOMElement()
   */
  getDOMElement = (): HTMLElement | null => {
    const { nodeRef } = this.props;
    if (!nodeRef || !nodeRef.current) {
      return null;
    }

    return nodeRef.current;
  }
  /**
   * => enter()
   */
  enter = () => {
    // Get the DOM-element
    const element = this.getDOMElement();
    if (!element) {
      return;
    }

    const {
      beforeEnter = () => {},
      afterEnter = () => {}
    } = this.props;

    // Run the event "beforeEnter"
    beforeEnter();

    // Set duration of the enter animation
    element.style.animationDuration = `${this.timeIn}ms`;
    // Set the class with the enter animation
    setClass(element, this.classEnter);
    
    // Wait "timeIn" ms
    this.clearTimers();
    this.timer = setTimeout(() => {
      // Remove the intermediate props
      element.style.removeProperty('animation-duration');
      removeClass(element, this.classEnter);
      // Run the event "afterEnter"
      afterEnter();
    }, this.timeIn);
  }
  /**
   * => exit()
   */
  exit = () => {
    // Get the DOM-element
    const element = this.getDOMElement();
    if (!element) {
      return;
    }

    const {
      beforeExit = () => {},
      afterExit = () => {}
    } = this.props;

    // Run the event "beforeExit"
    beforeExit();

    // Set duration of the enter animation
    element.style.animationDuration = `${this.timeOut}ms`;
    // Set the class with the enter animation
    setClass(element, this.classExit);
    
    // Wait "timeOut" ms
    this.clearTimers();
    this.timer = setTimeout(() => {
      // Run the event "afterExit"
      afterExit();
    }, this.timeOut);
  }
  /**
   * => clearTimers()
   */
  clearTimers = (): void => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }


  // ===< RENDER >===
  // 
  render = () => {
    return (
      <>
        { this.props.children }
      </>
    );
  }
}

export default SimpleAnimation;

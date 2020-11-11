import React, { createRef } from 'react';
// Third-party libs
import classNames from 'classnames';
// CSS
import './progressBar.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type ProgressBarColorScheme = 'default' | 'green' | 'silver';
type ProgressBarSize = 's' | 'm' | 'l';

type ProgressBarProps = {
  // The property controls the activity of the component.
  //  If "play" = true, the progress bar is active,
  //  if "play" = false, the progress bar isn't
  play: boolean,
  // The property defines the total time of the animation
  duration: number,
  // The property defines the height of the prograss bar.
  //  The default value = "m"
  size?: ProgressBarSize,
  // The property defines the color of the prograss bar
  //  The default value = "default"
  colorScheme?: ProgressBarColorScheme,
  // 
  reverse?: boolean,
  // 
  path?: boolean,
  // 
  className?: string,

  // => Events
  onFinished?: () => void
};


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class ProgressBar extends React.Component<ProgressBarProps> {

  // ===< CLASS FIELDS >===
  // 
  // Refs
  private progressBarRef: React.RefObject<HTMLDivElement>;
  // Main variables
  // Make so that the component does not support changes to some properties.
  //  Therefore, we will save these properties in class variables
  private propertyDuration: number;
  private propertySize: ProgressBarSize;
  private propertyColorScheme: ProgressBarColorScheme;
  private propertyPath: boolean;
  private propertyReverse: boolean;
  // Auxiliary variables
  private accumulatedTime: number;
  private startTime: number;
  private animationId: number;


  // ===< CONSTRUCTOR >===
  // 
  constructor(props: ProgressBarProps) {
    super(props);

    // Refs
    this.progressBarRef = createRef<HTMLDivElement>();
    // Main
    this.propertyDuration = this.props.duration;
    this.propertySize = this.props.size || 'm';
    this.propertyColorScheme = this.props.colorScheme || 'default';
    this.propertyPath = (typeof this.props.path === 'undefined') ? true : this.props.path;
    this.propertyReverse = (typeof this.props.reverse === 'undefined') ? true : this.props.reverse;
    // Auxiliary
    this.accumulatedTime = 0;
    this.startTime = 0;
    this.animationId = 0;
  }


  // ===< LIFE CYCLES >===
  // 
  /**
   * 
   */
  componentDidUpdate = (prevProps: ProgressBarProps) => {
    // Desctructure the props
    const { play: prevPlay } = prevProps;
    const { play } = this.props;

    // Handle only changes to the "play" property
    if (prevPlay === play) {
      return;
    }

    // If "play"
    if (play) {
      // We start the animation
      this.playAnimation();
      // console.log('play - accumulatedTime', this.accumulatedTime)

    // If don't play
    } else {
      // We stop the animation
      this.clearAnimation();
      // Save the time the animation was active.
      //  In the next time we'll start animation from this point, not from the beginning
      this.setStartTime(this.accumulatedTime);
      // console.log('pause - accumulatedTime', this.accumulatedTime)
    }
  }
  componentWillUnmount = () => {
    this.clearAnimation();
  }


  // ===< UTILS >===
  // 
  setStartTime = (value: number): void => {
    this.startTime = value;
  }
  setAccumulatedTime = (value: number): void => {
    this.accumulatedTime = value;
  }
  setAnimationId = (value: number): void => {
    this.animationId = value;
  }
  /**
   * => getClasses()
   * 
   * Returns classes to apply to the root element
   */
  getClasses = () => {
    const { className } = this.props;

    const classes = classNames(
      // The default class
      'progress',
      { 'progress__path': this.propertyPath },
      // From the props
      { [`${className}`]: !!className },
      // Size
      { 'progress--s': this.propertySize === 's' },
      { 'progress--l': this.propertySize === 'l' }
    );

    return classes;
  }
  /**
   * => getClassesForBar()
   * 
   * Returns classes to apply to the bar
   */
  getClassesForBar = () => {
    const classes = classNames(
      // The default class
      'progress__bar',
      // Color schemes
      { 'progress__bar--green': this.propertyColorScheme === 'green' },
      { 'progress__bar--silver': this.propertyColorScheme === 'silver' }
    );

    return classes;
  }
  /**
   * => clearAnimation()
   * 
   * The function cancels the animation that was started earlier
   */
  clearAnimation = () => {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  };
  /**
   * => playAnimation()
   * 
   * The function animates the progres bar
   */
  playAnimation = () => {
    
    const { onFinished = () => {} } = this.props;
    // Remember the start point of time of the animation
    const start = Date.now();

    const animate = () => {
      
      // Compute the percentage of time passed.
      //  Consider the start point
      const now = Date.now();
      const timeFraction = this.startTime + (now - start) / this.propertyDuration;
      
      // Save the total time of the animation
      this.setAccumulatedTime(timeFraction);

      // Convert the value to a percentage
      const progress = Math.ceil(timeFraction * 100);
      // Render the progress bar with the new percentage
      this.drawProgress(progress);

      // If time is left
      if (timeFraction < 1) {
        this.clearAnimation();
        this.setAnimationId(requestAnimationFrame(animate));

      // If time is over
      } else {
        onFinished();
      }
    }

    this.clearAnimation();
    this.setAnimationId(requestAnimationFrame(animate));
  };
  /**
   * => drawProgress()
   * 
   * The function draws the progress bar,
   *  exactly sets the width of the area "div"
   * 
   * @param progress - the progress percent
   */
  drawProgress = (progress: number): void => {
    // Consider the property "reverse"
    const value = this.propertyReverse ? (100 - progress) : progress;
    // Get the HTML-element
    const element = this.progressBarRef.current;
    if (!element) {
      return;
    }
    // Sets the width
    element.style.width = `${value}%`;
  }


  // ===< RENDER >===
  // 
  render = () => {
    return (
      <div className={ this.getClasses() }>
        <div
          className={ this.getClassesForBar() }
          ref={ this.progressBarRef }
          style={{ width: `${ this.propertyReverse ? '100%' : '0%' }` }}
        ></div>
      </div>
    );
  }
}

export default ProgressBar;

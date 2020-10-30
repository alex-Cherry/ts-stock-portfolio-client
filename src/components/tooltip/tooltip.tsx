import React, { createRef } from 'react';
// CSS
import './tooltip.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type TooltipCSSProperty = 'left' | 'top' | 'opacity';

// PROPS
type TooltipProps = {
  // A text of the tooltip
  text: string,
  // The property stores id of the target element.
  // The target element is the element that the tooltip is used for
  elementId: string,
  // This prop defines a delay time in ms for displaying the tooltip
  delayShow?: number
};

// STATE
type TooltipState = {
};


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class Tooltip extends React.Component<TooltipProps, TooltipState> {
  
  // ===< CLASS FIELDS >===
  // 
  private targetElement: Element | null = null;
  private divRef: React.RefObject<HTMLDivElement>;
  private timerShow: NodeJS.Timeout | null = null;


  // ===< CONSTRUCTOR >===
  // 
  constructor(props: TooltipProps) {
    super(props);
    // Initialize ref-s
    this.divRef = createRef<HTMLDivElement>();
  }


  // ===< LIFE CYCLES >===
  // 
  /**
   * => componentDidMount()
   */
  componentDidMount = () => {
    const { elementId } = this.props;

    // Find the target element
    this.targetElement = document.querySelector(`#${elementId}`);
    // Define the event listeners for the target element
    this.bindListeners();
  }
  /**
   * => componentWillUnmount()
   */
  componentWillUnmount = () => {
    // 
    this.clearTimers();
    // Remove the event listeners from the target element
    this.unbindListeners();
    // Zero the target element
    this.targetElement = null;
  }


  // ===< EVENT HANDLERS >===
  // 
  /**
   * => mouseEnterHandler()
   */
  mouseEnterHandler = () => {
    this.showTooltip();
  }
  /**
   * => mouseLeaveHandler()
   */
  mouseLeaveHandler = () => {
    this.clearTimers();
    this.hideTooltip();
  }


  // ===< UTILS >===
  // 
  /**
   * => bindListeners()
   * 
   * The function assigns the event handlers for the target element
   */
  bindListeners = () => {
    if (!this.targetElement) {
      return;
    }

    this.targetElement.addEventListener('mouseenter', this.mouseEnterHandler, false);
    this.targetElement.addEventListener('mouseleave', this.mouseLeaveHandler, false);
  }
  /**
   * => unbindListeners()
   * 
   * The function removes the event handlers from the target element
   */
  unbindListeners = () => {
    if (!this.targetElement) {
      return;
    }

    this.targetElement.removeEventListener('mouseenter', this.mouseEnterHandler, false);
    this.targetElement.removeEventListener('mouseleave', this.mouseLeaveHandler, false);
  }
  /**
   * => showTooltip()
   * 
   * The function displays the tooltip
   */
  showTooltip = (): void => {

    if (!this.divRef.current) {
      return;
    }

    this.clearTimers();
    // Get the coordinates of the tooltip
    const position = this.getPosition();
    this.setStyleForTooltip('top', `${position.y}px`);
    this.setStyleForTooltip('left', `${position.x}px`);
    // Set the tooltip to be visible with a delay
    this.timerShow = setTimeout(() => {
      this.setStyleForTooltip('opacity', '1');
    }, this.getDelayShow());

  }
  /**
   * => hideTooltip()
   * 
   * * The function hides the tooltip
   */
  hideTooltip = (): void => {
    // Set the tooltip to be hidden
    this.setStyleForTooltip('opacity', '0');
  }
  /**
   * => getPosition()
   */
  getPosition = (): { x: number, y: number } => {
    // Default value
    const coord = { x: 0, y: 0};

    if (!this.divRef.current || !this.targetElement) {
      return coord;
    }

    // Compute coordinates
    const rectForTarget = this.targetElement.getBoundingClientRect();
    const rectForDiv = this.divRef.current.getBoundingClientRect();
    coord.y = rectForTarget.top + rectForTarget.height + 10;
    coord.x = ((2 * rectForTarget.left + rectForTarget.width - rectForDiv.width) / 2);

    return coord;
  }
  /**
   * => setStyleForTooltip()
   * 
   * 
   * 
   * @param property 
   * @param value 
   */
  setStyleForTooltip = (property: TooltipCSSProperty , value: string) => {
    if (!this.divRef.current) {
      return;
    }
    this.divRef.current.style[property] = value;
  }
  /**
   * => clearTimers()
   * 
   * The function clears all timeouts
   */
  clearTimers = (): void => {
    if (this.timerShow) {
      clearTimeout(this.timerShow);
    }
  }
  /**
   * => getDelayShow()
   * 
   * The function gets the delay value from the props
   */
  getDelayShow = (): number => {
    return this.props.delayShow || 500;
  }


  // ===< RENDER >===
  // 
  render = () => {

    const { text } = this.props;

    return (
      <div
        className="tooltip"
        ref={ this.divRef }
      >
        <div className="tooltip__wrapper">

          {/* arrow */}
          <div className="tooltip__arrow tooltip__arrow--center">
          </div>

          {/* text */}
          <span className="tooltip__text">
            { text }
          </span>
            
        </div>
      </div>
    );
  }

}

export default Tooltip;

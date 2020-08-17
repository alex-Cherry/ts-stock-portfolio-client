import React, { CSSProperties } from 'react';
// inner components
import Tab from "./tab";
import TabInner from "./tabInner";
// utils
import { setClass, removeClass } from '../../utils/checkClassesForRefObjects';
// svg
import { ReactComponent as ArrowLeft } from '../../assets/svg/tabs-scroll-left.svg';
import { ReactComponent as ArrowRight } from '../../assets/svg/tabs-scroll-right.svg';
// third-party libs
import classNames from 'classnames';
// css
import './tabs.scss';


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

type TabsProps = {
  children: React.ReactNode,
  scrollable?: boolean,
  fullWidth?: boolean,
  scrollStep?: "single" | "multi",
  className?: string,
  onChange?: (numTab: number) => void
}
type TabsState = {
  activeTab: number
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class Tabs extends React.Component<TabsProps, TabsState> {

  // refs
  private refTabContainer: React.RefObject<HTMLDivElement>;
  private refContent: React.RefObject<HTMLDivElement>;
  private refFirstTab: React.RefObject<HTMLDivElement>;
  private refLeftArrow: React.RefObject<HTMLDivElement>;
  private refRightArrow: React.RefObject<HTMLDivElement>;
  // inner variables
  private widthOfSlider: number = 0;
  private widthOfContent: number = 0;


  // CONSTRUCTOR
  constructor(props: TabsProps) {
    super(props);
    // refs
    this.refTabContainer = React.createRef<HTMLDivElement>();
    this.refFirstTab = React.createRef<HTMLDivElement>();
    this.refContent = React.createRef<HTMLDivElement>();
    this.refLeftArrow = React.createRef<HTMLDivElement>();
    this.refRightArrow = React.createRef<HTMLDivElement>();
    // state
    this.state = {
      activeTab: 0,
    }

    const { children } = this.props;
    // check, whether each item is a Tab.
    // if it's not, throw an error
    React.Children.forEach(children, (item: any) => {
      if (!this.isTab(item)) {
        throw new Error(`Component 'Tabs' can have just a 'Tab' component as its children`);
      }
    });
  }


  // LIFECYCLE
  componentDidMount = () => {
    // define the width of the slider.
    // it's equal to the width of a tab.
    // it's suppoused, that the tabs have the same width
    if (this.refFirstTab.current) {
      const rect = this.refFirstTab.current.getBoundingClientRect();
      this.widthOfSlider = rect.width;
    }
    // define the width of an area, where tabs are rendered
    if (this.refContent.current) {
      const rect = this.refContent.current.getBoundingClientRect();
      this.widthOfContent = rect.width;
    }
    // set 
    this.setVisibilityOfArrows();
    // set active tab = 0
    this.setState({
      activeTab: 0
    });
  }


  // UTILS
  /**
   * func renders tabs in the tab panel
   */
  renderTabs = () => {
        
    const { activeTab } = this.state;
    const { fullWidth = false } = this.props;
    // define css-classes for tab-wrapper
    const classes = classNames(
      'tabs__tab-wrapper',
      { 'tabs__tab--fullwidth': fullWidth }
    );

    const { children } = this.props;
    // map each child Tab-component to TabInner-component.
    // Component TabInner has more properties and also has formatted render
    return React.Children.map(children, (item: any, idx) => (
      <div
        className={ classes }
        ref={ idx === 0 ? this.refFirstTab : undefined }
        key={ idx }
      >
        <TabInner
          { ...item.props }
          value={ idx }
          active={ activeTab === idx }
          onClick={ this.onClickTabHandler }
        />
      </div>
    ));
  }

  /**
   * func renders the block with left arrow
   */
  renderLeftArrow = () => {
    const { scrollable = false } = this.props;
    // return nothing, if the component isn't scrollable
    if (!scrollable) {
      return null;
    }
    // otherwise return left arrow
    return (
      <div
        className="tabs__scroll-btn"
        ref={ this.refLeftArrow }
      >
        <ArrowLeft
          className="tabs__scroll-arrow"
          onClick={ this.onClickLeftArrowHandler }
        />
      </div>
    );
  }

  /**
   * func renders the block with right arrow
   */
  renderRightArrow = () => {
    const {
      scrollable = false
    } = this.props;
    // return nothing, if the component isn't scrollable
    if (!scrollable) {
      return null;
    }
    // otherwise return right arrow
    return (
      <div
        className="tabs__scroll-btn"
        ref={ this.refRightArrow }
      >
        <ArrowRight
          className="tabs__scroll-arrow"
          onClick={ this.onClickRightArrowHandler }
        />
      </div>
    );
  }

  /**
   * function checks, whether obj is a Tab-component
   * 
   * @param obj - react-element, which must be checked, whether it is a TabComponent
   */
  isTab = (obj: React.ReactElement<{}>): boolean => {
    return obj.hasOwnProperty('type') && obj.type === Tab;
  }

  /**
   * returns style for the slider: width- and left-properties
   */
  getSliderStyle = (): CSSProperties => {
    const { activeTab } = this.state;

    return {
      width: this.widthOfSlider,
      left: 0 + activeTab * this.widthOfSlider
    }
  }

  /**
   * scrolls the block "content" to a specified x-coord
   * 
   * @param left - 
   */
  contentScrollTo = (left: number) => {
    this.refContent.current?.scrollTo({
      left,
      top: 0,
      behavior: "smooth"
    });
  }

  /**
   * scrolls the block "content" by a specified value
   * 
   * @param step - 
   */
  contentScrollBy = (step: number) => {
    this.refContent.current?.scrollBy({
      left: step,
      top: 0,
      behavior: "smooth"
    });
  }

  /**
   * func configures visibility arrow-buttons
   */
  setVisibilityOfArrows = (): void => {
    // 
    const leftContent = this.refContent.current?.scrollLeft || 0;
    const rightContent = leftContent + this.widthOfContent;
    const rightContentMax = this.getChildrenCount() * this.widthOfSlider;
    // classes for arrows
    const classArrowNonvisible = 'tabs__scroll-btn--nonvisible';
    const classArrowDisabled = 'tabs__scroll-btn--disabled';

    // => left arrow
    // if the most left tab is being shown
    if (leftContent === 0) {
      setClass(this.refLeftArrow, classArrowNonvisible);
      setClass(this.refLeftArrow, classArrowDisabled);
    // 
    } else {
      removeClass(this.refLeftArrow, classArrowNonvisible);
      removeClass(this.refLeftArrow, classArrowDisabled);
    }

    // => right arrow
    // if the most right tab is being shown
    if (rightContent === rightContentMax) {
      setClass(this.refRightArrow, classArrowNonvisible);
      setClass(this.refRightArrow, classArrowDisabled);
    // 
    } else {
      removeClass(this.refRightArrow, classArrowNonvisible);
      removeClass(this.refRightArrow, classArrowDisabled);
    }
  }

  /**
   * returns count of child tabs
   */
  getChildrenCount = (): number => {
    // get children
    const { children } = this.props;
    // 
    return React.Children.count(children);
  }

  /**
   * 
   * @param val 
   */
  /**
   * defines classes, that need to apply to the root element
   */
  getClasses = (): string => {

    const {
      className = ''
    } = this.props;

    const classes = classNames(
      // default classes
      'tabs',
      // classes from props
      { [`${className}`]: !!className }
    );

    return classes;
  }


  // EVENT HANDLERS
  onClickTabHandler = (val: number) => {

    // get the left-coord of the tab, that was clicked on
    const leftTab = val * this.widthOfSlider;
    // get the right-coord of the tab, that was clicked on
    const rightTab = leftTab + this.widthOfSlider;
    // get the left position of the visible part of the scrollable area
    const leftContent = this.refContent.current?.scrollLeft || 0;

    // diff is a value that need to scroll by to the left,
    // when we clicked on the most right visible (partially or wholly) tab
    const diff = rightTab - (leftContent + this.widthOfContent);
    if (diff > 0) {
      this.contentScrollBy(diff);

    // if we clicked on the most left tab,
    // define a value that need to scroll by to the right
    } else if (leftTab < leftContent) {
      this.contentScrollBy(leftTab - leftContent);

    }

    const {
      onChange = (numTab: number) => {}
    } = this.props;

    // set active tab
    this.setState({
      activeTab: val
    });

    onChange(val);
  }

  /**
   * handles a click on the right arrow
   */
  onClickRightArrowHandler = () => {
    // get the mode of scrolling
    const { scrollStep = "multi" } = this.props;

    // get the left position of the visible part of the scrollable area
    const leftContent = this.refContent.current?.scrollLeft || 0;
    // get the right position of the visible part of the scrollable area
    const rightContent = leftContent + this.widthOfContent;
    // get the number of the tab, that goes after the last wholly-visible tab
    const num = Math.floor(rightContent / this.widthOfSlider);

    // mode "MULTI"
    if (scrollStep === 'multi') {
      // define a new left position, that need to scroll to
      const left = num * this.widthOfSlider;
      // scroll the content to a new left position
      this.contentScrollTo(left);

    // mode "SINGLE"
    } else if (scrollStep === 'single') {
      // define the right position of the tab, that must be shown after scrolling
      const rightTabToBe = num * this.widthOfSlider + this.widthOfSlider;
      // compute the "x-value", that need to scroll by
      const diff = rightTabToBe - rightContent;
      // scroll the content by a gotten diff
      this.contentScrollBy(diff);

    }
  }

  /**
   * handles a click on the left arrow
   */
  onClickLeftArrowHandler = () => {
    // get the mode of scrolling
    const { scrollStep = "multi" } = this.props;
    // get the left position of the visible part of the scrollable area
    const leftContent = this.refContent.current?.scrollLeft || 0;
    
    // mode "MULTI"
    if (scrollStep === 'multi') {
      // the number of a tab, that's the most left visible (partially or wholly)
      const num = Math.floor(leftContent / this.widthOfSlider);
      // compute the right position of a necessary tab
      const rightContentToBe = num * this.widthOfSlider + this.widthOfSlider;
      // define a new left position, that need to scroll to
      let left = rightContentToBe - this.widthOfContent;
      left = left >= 0 ? left : 0; 
      // scroll the content to a new left position
      this.contentScrollTo(left);

    // mode "SINGLE"
    } else if (scrollStep === 'single') {
      // define the num of a tab, that must be shown after scrolling on one step
      const num = Math.ceil(leftContent / this.widthOfSlider - 1);
      // compute the left position of a necessary tab
      const leftTabToBe = num * this.widthOfSlider;
      // compute the "x-value", that need to scroll by
      const diff = leftTabToBe - leftContent;
      if (diff < 0) {
        this.contentScrollBy(diff);
      }

    }
  }
  onScrollHandler = () => {
    this.setVisibilityOfArrows();
  }


  // RENDER
  render() {

    return (
      <div
        className={ this.getClasses() }
        ref={ this.refTabContainer }
      >
        {/* arrow - left */}
        { this.renderLeftArrow() }

        {/* content */}
        <div
          className="tabs__content"
          ref={ this.refContent }
          onScroll={ this.onScrollHandler }
        >
          <div className="tabs__content-container">
            {/* tabs */}
            { this.renderTabs() }
          </div>

          {/* slider */}
          <div
            className="tabs__slider"
            style={ this.getSliderStyle() }
          ></div>

        </div>

        {/* arrow - right */}
        { this.renderRightArrow() }

      </div>
    );
  }
}

export default Tabs;

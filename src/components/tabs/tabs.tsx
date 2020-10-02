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


// DESCRIPTION:
// 
// This component consists of a list of tabs.
// 
// When we use this component in other components, we must use component "Tab" as its child.
// Component "Tab" has just a property "text".
// Inside the component "Tabs" we convert component "Tab" to component "TabInner",
//  which has more properties for more precise setting.
// It's done so that when using the component, you do not need to set settings
//  that are only necessary for the internal mechanism of component "Tabs".
// 


////////////////////////////////////////////////////////////////////////////////
// 
// EXTRA
// 
////////////////////////////////////////////////////////////////////////////////

// PROPS
type TabsProps = {
  // Child components "Tab"
  children: React.ReactNode,
  // This flag indicates that we can scroll this component.
  // When "scrollable" = true, two arrows are rendered in the component,
  //  these arrows allow to scroll tabs in the component
  scrollable?: boolean,
  // This property defines the mode how tabs in the component will be scrolled.
  //  - single => step is equal to one tab
  //  - multi => the tab, that goes after the last wholly-visible tab, becomes the first tab
  scrollStep?: "single" | "multi",
  // A tab in a component has the default width.
  // If "fullWidth" = true, the width of tabs will be fitted to the width of the component
  fullWidth?: boolean,
  // A number of an active tab.
  // When the component is being created,
  //  we can point which tab will be active.
  // By default, "activeTab" = 0, i.e. the first tab
  activeTab?: number,
  // Extra classes that you can apply to the root element,
  //  when you use this component inside other ones.
  // It's assumed that will be used classes that define
  //  positioning of the component
  className?: string,

  // => Events
  // It occurs when an user click on a tab.
  // In the parameter "numTab" we get the number of the tab,
  //  that's was clicked
  onChange?: (numTab: number) => void
}

// STATE
type TabsState = {
  // Stores number of an active tab
  activeTab: number
}


////////////////////////////////////////////////////////////////////////////////
// 
// COMPONENT
// 
////////////////////////////////////////////////////////////////////////////////

class Tabs extends React.Component<TabsProps, TabsState> {

  // ===< CLASS FIELDS >===
  // 
  // refs
  private refTabContainer: React.RefObject<HTMLDivElement>;
  private refContent: React.RefObject<HTMLDivElement>;
  private refFirstTab: React.RefObject<HTMLDivElement>;
  private refLeftArrow: React.RefObject<HTMLDivElement>;
  private refRightArrow: React.RefObject<HTMLDivElement>;
  // inner variables
  private widthOfSlider: number = 0;
  private widthOfContent: number = 0;


  // ===< CONSTRUCTOR >===
  // 
  constructor(props: TabsProps) {
    super(props);
    // refs
    this.refTabContainer = React.createRef<HTMLDivElement>();
    this.refFirstTab = React.createRef<HTMLDivElement>();
    this.refContent = React.createRef<HTMLDivElement>();
    this.refLeftArrow = React.createRef<HTMLDivElement>();
    this.refRightArrow = React.createRef<HTMLDivElement>();
    // state
    let activeTab = this.props.activeTab || 0;
    // If we set "activeTab" greater than count of the tabs,
    //  change the value to "0".
    if (activeTab > this.getChildrenCount()) {
      activeTab = 0;
    }
    this.state = {
      activeTab: activeTab,
    }

    const { children } = this.props;
    // A component "Tabs" has just components "Tab" as a child.
    // So check, whether each item is a Tab.
    // If it's not, throw an error
    React.Children.forEach(children, (item: any) => {
      if (!this.isTab(item)) {
        throw new Error(`Component 'Tabs' can have just a 'Tab' component as its children`);
      }
    });
  }


  // ===< LIFECYCLE >===
  // 
  componentDidMount = () => {
    // Define the width of the slider.
    // It's equal to the width of a child tab.
    // It's suppoused, that the tabs have the same width
    if (this.refFirstTab.current) {
      const rect = this.refFirstTab.current.getBoundingClientRect();
      this.widthOfSlider = rect.width;
    }
    // Define the width of the area, where tabs are rendered
    if (this.refContent.current) {
      const rect = this.refContent.current.getBoundingClientRect();
      this.widthOfContent = rect.width;
    }
    // set 
    this.setVisibilityOfArrows();
    // 
    const { activeTab } = this.state;
    this.scrollToTab(activeTab)
    // set active tab
    this.setState({
      activeTab
    });
  }


  // ===< UTILS >===
  // 
  /**
   * Func renders the tabs in the tab panel
   */
  renderTabs = () => {
        
    const { activeTab } = this.state;
    const { fullWidth = false } = this.props;
    // Define css-classes for tab-wrapper
    const classes = classNames(
      'tabs__tab-wrapper',
      { 'tabs__tab--fullwidth': fullWidth }
    );

    const { children } = this.props;
    // Map each child component "Tab" to a component "TabInner".
    // Component "TabInner" has more properties and also has formatted render
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
   * Func renders the block with the left arrow
   */
  renderLeftArrow = () => {
    const { scrollable = false } = this.props;
    // Return nothing, if the component isn't scrollable
    if (!scrollable) {
      return null;
    }
    // Otherwise return the left arrow
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
   * Func renders the block with the right arrow
   */
  renderRightArrow = () => {
    const { scrollable = false } = this.props;
    // Return nothing, if the component isn't scrollable
    if (!scrollable) {
      return null;
    }
    // Otherwise return the right arrow
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
   * Function checks, whether obj is a Tab-component
   * 
   * @param obj - react-element, which must be checked, whether it is a TabComponent
   */
  isTab = (obj: React.ReactElement<{}>): boolean => {
    return obj.hasOwnProperty('type') && obj.type === Tab;
  }
  /**
   * Returns style for the slider: width- and left-properties
   */
  getSliderStyle = (): CSSProperties => {
    const { activeTab } = this.state;

    return {
      width: this.widthOfSlider,
      left: 0 + activeTab * this.widthOfSlider
    }
  }
  /**
   * Scrolls the block "Content" to the specified x-coord
   * 
   * @param left - the new left of the block "Content"
   */
  contentScrollTo = (left: number) => {
    // !! use here the method "scrollTo"
    this.refContent.current?.scrollTo({
      left,
      top: 0,
      behavior: "smooth"
    });
  }
  /**
   * Scrolls the block "Content" by the specified value
   * 
   * @param step
   */
  contentScrollBy = (step: number) => {
    // !! use here the method "scrollBy"
    this.refContent.current?.scrollBy({
      left: step,
      top: 0,
      behavior: "smooth"
    });
  }
  /**
   * Scrolls the block "Content" to the specified tab
   * 
   * @param tabNumber - 
   */
  scrollToTab = (tabNumber: number) => {
    // Get the left position of the tabNumber-th tab
    const leftTab = tabNumber * this.widthOfSlider;
    // Sroll to the nec position
    this.contentScrollTo(leftTab);
  }
  /**
   * Func configures visibility the arrow-buttons
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
    // If the most left tab is being shown,
    //  disable the left arrow
    if (leftContent === 0) {
      setClass(this.refLeftArrow, classArrowNonvisible);
      setClass(this.refLeftArrow, classArrowDisabled);
    //  otherwise, enable the left arrow
    } else {
      removeClass(this.refLeftArrow, classArrowNonvisible);
      removeClass(this.refLeftArrow, classArrowDisabled);
    }

    // => right arrow
    // If the most right tab is being shown,
    //  diable the right arrow
    if (rightContent === rightContentMax) {
      setClass(this.refRightArrow, classArrowNonvisible);
      setClass(this.refRightArrow, classArrowDisabled);
    //  otherwise, enable the right arrow
    } else {
      removeClass(this.refRightArrow, classArrowNonvisible);
      removeClass(this.refRightArrow, classArrowDisabled);
    }
  }
  /**
   * Returns count of the child tabs
   */
  getChildrenCount = (): number => {
    // Get the children
    const { children } = this.props;
    // 
    return React.Children.count(children);
  }
  /**
   * Defines classes, that need to apply to the root element
   */
  getClasses = (): string => {

    const {
      className = ''
    } = this.props;

    const classes = classNames(
      // default classes
      'tabs',
      // classes from the props
      { [`${className}`]: !!className }
    );

    return classes;
  }


  // ===< EVENT HANDLERS >===
  // 
  /**
   * Handles a click on a tab
   * 
   * @param val - number of the tab, that was clicked
   */
  onClickTabHandler = (val: number) => {

    // Get the left-coord of the tab, that was clicked on
    const leftTab = val * this.widthOfSlider;
    // Get the right-coord of the tab, that was clicked on
    const rightTab = leftTab + this.widthOfSlider;
    // Get the left position of the visible part of the scrollable area
    const leftContent = this.refContent.current?.scrollLeft || 0;

    // Diff is a value that need to scroll by to the left,
    // when we clicked on the most right visible (partially or wholly) tab
    const diff = rightTab - (leftContent + this.widthOfContent);
    if (diff > 0) {
      this.contentScrollBy(diff);

    // If we clicked on the most left tab,
    // define a value that need to scroll by to the right
    } else if (leftTab < leftContent) {
      this.contentScrollBy(leftTab - leftContent);

    }

    const {
      onChange = (numTab: number) => {}
    } = this.props;

    // Set active tab
    this.setState({
      activeTab: val
    });

    onChange(val);
  }
  /**
   * Handles a click on the right arrow
   */
  onClickRightArrowHandler = () => {
    // Get the mode of scrolling
    const { scrollStep = "multi" } = this.props;

    // Get the left position of the visible part of the scrollable area
    const leftContent = this.refContent.current?.scrollLeft || 0;
    // Get the right position of the visible part of the scrollable area
    const rightContent = leftContent + this.widthOfContent;
    // Get number of the tab, that goes after the last wholly-visible tab
    const num = Math.floor(rightContent / this.widthOfSlider);

    // mode "MULTI"
    if (scrollStep === 'multi') {
      // Define the new left position, that need to scroll to
      const left = num * this.widthOfSlider;
      // Scroll the content to the new left position
      this.contentScrollTo(left);

    // mode "SINGLE"
    } else if (scrollStep === 'single') {
      // Define the right position of the tab, that must be shown after scrolling
      const rightTabToBe = num * this.widthOfSlider + this.widthOfSlider;
      // Compute the "x-value", that need to scroll by
      const diff = rightTabToBe - rightContent;
      // Scroll the content by the gotten diff
      this.contentScrollBy(diff);

    }
  }
  /**
   * Handles a click on the left arrow
   */
  onClickLeftArrowHandler = () => {
    // Get the mode of scrolling
    const { scrollStep = "multi" } = this.props;
    // Get the left position of the visible part of the scrollable area
    const leftContent = this.refContent.current?.scrollLeft || 0;
    
    // mode "MULTI"
    if (scrollStep === 'multi') {
      // Number of a tab, that's the most left visible (partially or wholly)
      const num = Math.floor(leftContent / this.widthOfSlider);
      // Compute the right position of a necessary tab
      const rightContentToBe = num * this.widthOfSlider + this.widthOfSlider;
      // Define the new left position, that need to scroll to
      let left = rightContentToBe - this.widthOfContent;
      left = left >= 0 ? left : 0; 
      // Scroll the content to the new left position
      this.contentScrollTo(left);

    // mode "SINGLE"
    } else if (scrollStep === 'single') {
      // Define num of the tab, that must be shown after scrolling on one step
      const num = Math.ceil(leftContent / this.widthOfSlider - 1);
      // Compute the left position of the necessary tab
      const leftTabToBe = num * this.widthOfSlider;
      // Compute the "x-value", that need to scroll by
      const diff = leftTabToBe - leftContent;
      if (diff < 0) {
        this.contentScrollBy(diff);
      }

    }
  }
  // 
  onScrollHandler = () => {
    this.setVisibilityOfArrows();
  }


  // ===< RENDER >===
  // 
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

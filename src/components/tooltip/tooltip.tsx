import React, { useRef, useEffect } from 'react';
// import css
import './tooltip.scss';

type TooltipProps = {
  text: string,
  elementRef: React.RefObject<HTMLElement> | React.MutableRefObject<HTMLElement>
}

const Tooltip = (props: TooltipProps) => {

  const divRef = useRef<HTMLDivElement>(null);
  const { elementRef } = props;

  useEffect(() => {
    if (!elementRef.current || !divRef.current) {
      return;
    }

    const divElement = divRef.current as HTMLDivElement;
    const targetElement = elementRef.current as HTMLElement;

    // 
    const mouseEnterHandler = () => {
      // show tooltip
      divElement.style.display = 'block';
      // 
      const rectForTarget = targetElement.getBoundingClientRect();
      const rectForDiv = divElement.getBoundingClientRect();
      const y: number = rectForTarget.top + rectForTarget.height + 10;
      const x: number = (2 * rectForTarget.left + rectForTarget.width - rectForDiv.width) / 2;
      // 
      divElement.style.top = `${y}px`;
      divElement.style.left = `${x}px`;
    }
    // 
    const mouseLeaveHandler = () => {
      divElement.style.display = 'none';
    }

    // add event handlers
    targetElement.addEventListener('mouseenter', mouseEnterHandler);
    targetElement.addEventListener('mouseleave', mouseLeaveHandler);

    return () => {
      console.log('tooltip is deleted');
      targetElement.removeEventListener('mouseenter', mouseEnterHandler);
      targetElement.removeEventListener('mouseleave', mouseLeaveHandler);
    };
    
  }, [elementRef]);

  useEffect(() => {
    if (!elementRef) {
      console.log('ref is empty')
    }
  }, [elementRef]);
  
  // RENDER
  return (
    <div className="tooltip" ref={divRef} style={{ display: 'none' }}>
      <div className="tooltip-wrapper">

        {/* arrow */}
        <div className="tooltip-arrow center">
        </div>
        {/* text */}
        <span className="tooltip-text">
          { props.text }
        </span>
          
      </div>
     </div>

  );
}

export default Tooltip;

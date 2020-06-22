import React from 'react';
// 
import { ElementRef } from '../../utils/checkClassesForRefObjects';

import MaterialIcon from '../materialIcon';



export type ActionPanelItem = {
  iconName: string,
  ref: ElementRef<HTMLElement>,
  onClickHandler: () => void
}

type ActionPanelProps = {
  items: ActionPanelItem[],
  loading: boolean
}

const ActionPanel = (props: ActionPanelProps) => {

  const { items, loading } = props;

  if (loading) {
    return (
      <span className="action-item-wrapper">
        <span className="favorite-loader"></span>
      </span>
    );
  }

  return (
    <span>
      {/* {
        items.map(item => {
          return (
            <i
              key={item.iconName}
              ref={item.ref}
              className="material-icons"
              onClick={item.onClickHandler}
            >
              { item.iconName }
            </i>
          )
        })
      } */}
      <MaterialIcon
        iconName="add_circle_outline"
      />
      <MaterialIcon
        iconName="remove_circle_outline"
      />
      <MaterialIcon
        iconName="edit"
      />
    </span>
  );
}

export default ActionPanel;

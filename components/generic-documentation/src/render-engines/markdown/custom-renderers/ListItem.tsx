import React from 'react';

export interface ListItemProps {
  checked: boolean;
  index: number;
}

export const ListItem: React.FunctionComponent<ListItemProps> = ({
  index,
  children,
}) => {
  let newChildren = (children as any[])[0];
  newChildren =
    newChildren.props &&
    newChildren.props.element &&
    newChildren.props.element &&
    newChildren.props.element.props &&
    newChildren.props.element.props.children;

  let doesStarAppear = false;
  if (newChildren && Array.isArray(newChildren)) {
    newChildren = React.Children.map(newChildren, child => {
      if (
        typeof child === 'string' &&
        (child.trim() === '*' || child.trim() === '-')
      ) {
        if (doesStarAppear) {
          return ', ';
        } else {
          doesStarAppear = true;
          return ': ';
        }
      }
      return child;
    }).filter(child => child);
  }

  return (
    <li className={'cms__list-item'} key={index}>
      {doesStarAppear ? newChildren : children}
    </li>
  );
};

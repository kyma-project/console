import React, { useState } from 'react';
import { Icon } from 'fundamental-react';

import { NavigationItem as NavigationItemType } from '../services';
import { NavigationItem } from './NavigationItem';

import {
  NavigationContainer,
  NavigationHeader,
  NavigationArrow,
  CollapseArrow,
  NavigationItems,
} from './styled';

interface Props {
  title: string;
  icon: string;
  items: NavigationItemType[];
  groupType: string;
}

export const NavigationGroup: React.FunctionComponent<Props> = ({
  title,
  icon,
  items,
  groupType,
}) => {
  const [show, setShow] = useState(true);

  return (
    <NavigationContainer key={title}>
      {title && icon && (
        <NavigationHeader onClick={() => setShow(!show)}>
          <Icon size="m" glyph={icon} />
          {title}
          <NavigationArrow>
            <CollapseArrow open={show} />
          </NavigationArrow>
        </NavigationHeader>
      )}
      {show && (
        <NavigationItems showAll>
          {items.map(item => (
            <NavigationItem {...item} key={item.name} groupType={groupType} />
          ))}
        </NavigationItems>
      )}
    </NavigationContainer>
  );
};

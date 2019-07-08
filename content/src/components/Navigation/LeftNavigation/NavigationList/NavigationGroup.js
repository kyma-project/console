import React, { useState } from 'react';
import { Icon } from '@kyma-project/react-components';
import { tokenize } from '../../../../commons/helpers';

import {
  NavigationContainer,
  NavigationHeader,
  NavigationArrow,
  NavigationItems,
  NavigationItem,
  NavigationLinkWrapper,
  NavigationLink,
  CollapseArrow,
} from './styled';

function NavigationGroup({
  title,
  icon,
  items = [],
  groupType,
  isLinkActive,
  chooseActive,
}) {
  const [show, setShow] = useState(true);

  const renderNavigationItem = item => {
    if (!item) {
      return null;
    }

    return (
      <NavigationItem key={tokenize(item.name)}>
        <NavigationLinkWrapper>
          <NavigationLink
            active={isLinkActive({
              id: tokenize(item.name),
              type: groupType,
            })}
            onClick={() => {
              chooseActive({
                id: tokenize(item.name),
                type: groupType,
              });
            }}
            data-e2e-id={`navigation-link-${groupType}-${tokenize(item.name)}`}
          >
            {item.displayName}
          </NavigationLink>
        </NavigationLinkWrapper>
      </NavigationItem>
    );
  };

  return (
    <NavigationContainer>
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
          {items.map(item => renderNavigationItem(item))}
        </NavigationItems>
      )}
    </NavigationContainer>
  );
}

export default NavigationGroup;

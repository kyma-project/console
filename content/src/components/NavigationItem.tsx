import React, { useContext } from 'react';
import { navigate } from '@reach/router';
import { luigiClient, toKebabCase } from '@kyma-project/common';

import {
  NavigationService,
  NavigationItem as NavigationItemType,
} from '../services';

import {
  NavigationItem as StyledNavigationItem,
  NavigationLinkWrapper,
  NavigationLink,
} from './styled';

interface Props extends NavigationItemType {
  groupType: string;
}

export const NavigationItem: React.FunctionComponent<Props> = ({
  groupType,
  ...item
}) => {
  const { activeNavNode } = useContext(NavigationService);
  if (!item) {
    return null;
  }
  const kebabCasedName = toKebabCase(item.name);
  const active =
    activeNavNode &&
    activeNavNode.topic === item.name &&
    activeNavNode.group === item.group;

  return (
    <StyledNavigationItem>
      <NavigationLinkWrapper>
        <NavigationLink
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            luigiClient
              .linkManager()
              .navigate(`/docs/${groupType}/${kebabCasedName}`);
            navigate(`/${groupType}/${kebabCasedName}`, {
              state: {
                group: groupType,
                topic: kebabCasedName,
              },
            });
            window.scrollTo(0, 0);
          }}
          data-e2e-id={`navigation-link-${groupType}-${kebabCasedName}`}
          active={active}
        >
          {item.displayName}
        </NavigationLink>
      </NavigationLinkWrapper>
    </StyledNavigationItem>
  );
};

import React from 'react';

import { Navigation } from '../services';
import { NavigationGroup } from './NavigationGroup';
import { Wrapper } from './styled';

interface Props {
  navigation: Navigation;
}

export const NavigationList: React.FunctionComponent<Props> = ({
  navigation,
}) => {
  const icons: { [group: string]: string } = {
    root: 'database',
    default: 'Chart-Tree-Map',
  };

  return (
    <Wrapper>
      {Object.keys(navigation).map(group => {
        const items = navigation[group];
        const groupType = group.toLowerCase();
        const icon = icons[groupType] || icons['default'];
        const key = `navigation-${group}`;

        return (
          <NavigationGroup
            data-e2e-id={key}
            key={key}
            title={`${group[0].toUpperCase()}${group.slice(1)}`}
            icon={icon}
            items={items}
            groupType={groupType}
          />
        );
      })}
    </Wrapper>
  );
};

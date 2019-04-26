import React, { useState } from 'react';
import { Icon } from '@kyma-project/react-components';
import { tokenize } from '../../../../commons/helpers';

import NavigationSections from './NavigationSections';
import {
  NavigationContainer,
  NavigationHeader,
  NavigationArrow,
  NavigationItems,
  NavigationItem,
  NavigationSectionArrow,
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
  activeContent,
  activeNav,
  activeNodes,
  chooseActive,
  setActiveNav,
  history,
  ...otherProps
}) {
  const renderArrow = item => (
    <NavigationSectionArrow
      onClick={() => {
        setActiveNav({
          id: tokenize(item.name),
          type: groupType,
          hash: '',
        });
      }}
      activeArrow={
        tokenize(item.name) === activeNav.id ||
        tokenize(item.name) === activeContent.id
      }
      active={isLinkActive({
        id: tokenize(item.name),
        type: groupType,
      })}
      data-e2e-id={`navigation-arrow-${groupType}-${tokenize(item.name)}`}
    />
  );

  const renderNavigationItem = item => {
    let filesByTypes = {};

    if (!item || !item.assets || !item.assets.length) {
      return null;
    }

    item.assets.forEach(asset =>
      asset.files.forEach(file => {
        let type = file.metadata.type || file.metadata.title;
        if (!filesByTypes[type]) {
          filesByTypes[type] = [];
        }
        filesByTypes[type].push(file);
      }),
    );

    return (
      <NavigationItem key={tokenize(item.name)}>
        <NavigationLinkWrapper>
          {item.assets && item.assets.length > 0 && renderArrow(item)}
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
        <NavigationSections
          items={filesByTypes}
          groupType={groupType}
          rootId={tokenize(item.name)}
          activeContent={activeContent}
          activeNav={activeNav}
          activeNodes={activeNodes}
          setActiveNav={setActiveNav}
          chooseActive={chooseActive}
          isLinkActive={isLinkActive}
        />
      </NavigationItem>
    );
  };
  const [show, setShow] = useState(true);
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

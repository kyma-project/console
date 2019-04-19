import React from 'react';
import { tokenize } from '../../../../commons/helpers';

import {
  NavigationItems,
  NavigationItem,
  NavigationLinkWrapper,
  NavigationLink,
  NavigationSectionArrow,
} from './styled';

function NavigationSections({
  items,
  groupType,
  rootId,
  parentId,
  isLinkActive,
  activeContent,
  activeNav,
  activeNodes,
  chooseActive,
  setActiveNav,
  history,
  ...otherProps
}) {
  const hashing = (item, type) => {
    if (!(item && item.metadata)) return;

    const topicType = item.metadata.type
      ? tokenize(item.metadata.type)
      : tokenize(item.metadata.title);
    return `${topicType}-${tokenize(item.metadata.title)}`;
  };

  const renderArrow = (anchor, hash, isActive, isActiveNavArrow) => (
    <NavigationSectionArrow
      onClick={() => {
        setActiveNav({
          id: rootId,
          type: groupType,
          hash: hash,
        });
      }}
      activeArrow={isActiveNavArrow}
      active={isActive}
      data-e2e-id={`navigation-arrow-${groupType}-${rootId}-${anchor}`}
    />
  );

  const renderNavigationItem = (items, type) => {
    const categoryHash = tokenize(type);
    const isTopicTheType =
      items &&
      items.length === 1 &&
      items[0].metadata &&
      items[0].metadata.type &&
      items[0].metadata.title !== items[0].metadata.type;
    const hasSubElements = items && (items.length > 1 || isTopicTheType);

    let isActiveNavArrow = false;
    let isActive = false;

    if (activeContent.id === rootId) {
      isActive =
        activeNodes &&
        (activeNodes.groupOfDocuments &&
          activeNodes.groupOfDocuments.id ===
            `${categoryHash}-${categoryHash}`);

      if (
        activeNodes &&
        activeNodes.groupOfDocuments &&
        activeNodes.groupOfDocuments.id.startsWith(categoryHash)
      ) {
        isActiveNavArrow = true;
      }
    }

    let isClickedNav =
      activeNav.id === rootId &&
      activeNav.hash &&
      activeNav.hash.startsWith(categoryHash);

    if (!isActiveNavArrow) {
      isActiveNavArrow =
        hasSubElements &&
        activeNav.id === rootId &&
        activeNav.hash &&
        activeNav.hash.startsWith(categoryHash);
    }

    return (
      <NavigationItem key={`${type}`}>
        <NavigationLinkWrapper>
          {hasSubElements &&
            renderArrow(
              tokenize(type),
              categoryHash,
              isActive,
              isActiveNavArrow,
            )}
          <NavigationLink
            active={isActive}
            noArrow={!hasSubElements}
            onClick={() => {
              chooseActive({
                id: rootId,
                type: groupType,
                hash: `${categoryHash}-${categoryHash}`,
              });
            }}
            data-e2e-id={`navigation-link-${groupType}-${rootId}-${categoryHash}`}
          >
            {type}
          </NavigationLink>
        </NavigationLinkWrapper>
        {hasSubElements &&
          renderNavigationSubItems(items, type, isActive, isClickedNav)}
      </NavigationItem>
    );
  };

  const renderNavigationSubItems = (
    item,
    type,
    isParentActive,
    isParentClicked,
  ) => {
    return (
      <NavigationItems
        marginTop
        secondary
        show={isParentActive || isParentClicked}
        data-e2e-id={`${e2eId}-${tokenize(type)}`}
      >
        {item &&
          item.map((subItem, index) => {
            const hash = hashing(subItem, type);
            const isActive =
              activeNodes &&
              (activeNodes.document && activeNodes.document.id === hash);

            return (
              <NavigationItem key={index}>
                <NavigationLinkWrapper>
                  <NavigationLink
                    active={isActive}
                    noArrow={true}
                    onClick={() => {
                      chooseActive({
                        id: rootId,
                        type: groupType,
                        hash: hash,
                      });
                    }}
                    data-e2e-id={`navigation-link-${groupType}-${rootId}-${tokenize(
                      subItem.metadata.title,
                    )}`}
                  >
                    {subItem.metadata.title}
                  </NavigationLink>
                </NavigationLinkWrapper>
              </NavigationItem>
            );
          })}
      </NavigationItems>
    );
  };

  let isActiveNav = false;
  if (
    parentId &&
    activeNodes &&
    activeNodes.groupOfDocuments &&
    activeNodes.groupOfDocuments.id.startsWith(parentId)
  ) {
    isActiveNav = activeContent.id === rootId;
  } else {
    isActiveNav = !parentId ? activeContent.id === rootId : false;
  }

  let isClickedNav = parentId
    ? activeNav.id === rootId &&
      activeNav.hash &&
      activeNav.hash.startsWith(parentId)
    : activeNav.id === rootId;

  const e2eId = `navigation-items-${groupType}-${rootId}`;

  return (
    <NavigationItems
      marginTop
      secondary
      show={isActiveNav || isClickedNav}
      data-e2e-id={e2eId}
    >
      {items &&
        Object.keys(items).map(type => {
          return renderNavigationItem(items[type], type);
        })}
    </NavigationItems>
  );
}

export default NavigationSections;

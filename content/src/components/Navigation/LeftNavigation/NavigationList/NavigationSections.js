import React from "react";

import {
  NavigationItems,
  NavigationItem,
  NavigationLinkWrapper,
  NavigationLink,
  NavigationSectionArrow,
} from "./styled";

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
  const hashing = item => {
    if (parentId) return `${parentId}-${item.anchor}`;

    const topicType = item.topicType
      ? item.topicType.replace(/ /g, "-").toLowerCase()
      : item.anchor;
    return `${topicType}-${item.anchor}`;
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

  const renderNavigationItem = item => {
    const hash = hashing(item);
    const hasSubElements = item && item.titles && item.titles.length > 0;

    let isActiveNavArrow = false;
    let isActive = false;

    if (activeContent.id === rootId) {  
      if (parentId) {
        isActive =
          activeNodes &&
          (activeNodes.document && activeNodes.document.id === hash);
      } else {
        isActive =
          activeNodes &&
          (activeNodes.groupOfDocuments &&
            activeNodes.groupOfDocuments.id === hash);
      }

      if (
        activeNodes &&
        activeNodes.groupOfDocuments &&
        activeNodes.groupOfDocuments.id.startsWith(hash)
      ) {
        isActiveNavArrow = true;
      }
    }

    if (!isActiveNavArrow) {
      isActiveNavArrow =
        hasSubElements &&
        activeNav.id === rootId &&
        activeNav.hash &&
        activeNav.hash.startsWith(item.anchor);
    }

    const key = parentId
      ? `${rootId}-${parentId}-${item.anchor}`
      : `${rootId}-${item.anchor}`;

    return (
      <NavigationItem key={key}>
        <NavigationLinkWrapper>
          {hasSubElements && renderArrow(item.anchor, hash, isActive, isActiveNavArrow)}
          <NavigationLink
            active={isActive}
            noArrow={!hasSubElements}
            onClick={() => {
              chooseActive({
                id: rootId,
                type: groupType,
                hash: hash,
              })
            }}
            parentId={parentId}
            data-e2e-id={`navigation-link-${groupType}-${rootId}-${item.anchor}`}
          >
            {item.name}
          </NavigationLink>
        </NavigationLinkWrapper>
        {hasSubElements && (
          <NavigationSections
            items={item.titles}
            groupType={groupType}
            rootId={rootId}
            parentId={item.anchor}
            isLinkActive={isLinkActive}
            activeContent={activeContent}
            activeNav={activeNav}
            activeNodes={activeNodes}
            setActiveNav={setActiveNav}
            chooseActive={chooseActive}
            history={history}
          />
        )}
      </NavigationItem>
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

  const e2eId =
    `navigation-items-${groupType}-${rootId}${parentId ? `-${parentId}` : ``}`;

  return (
    <NavigationItems marginTop secondary show={isActiveNav || isClickedNav} data-e2e-id={e2eId}>
      {items && items.map(item => renderNavigationItem(item))}
    </NavigationItems>
  );
}

export default NavigationSections;

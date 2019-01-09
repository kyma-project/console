import React from "react";

import NavigationSections from "./NavigationSections";
import {
  NavigationContainer,
  NavigationHeader,
  NavigationItems,
  NavigationItem,
  NavigationSectionArrow,
  NavigationLinkWrapper,
  NavigationLink
} from "./styled";

function NavigationGroup({
  title,
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
          id: item.id,
          type: groupType,
          hash: "",
        });
      }}
      activeArrow={item.id === activeNav.id || item.id === activeContent.id}
      active={isLinkActive({
        id: item.id,
        type: groupType,
      })}
    />
  );

  const renderNavigationItem = item => {
    let topics = null;
    if (otherProps.topics) {
      topics = otherProps.topics.find(obj => obj.id === item.id);
    }

    return (
      <NavigationItem key={item.id}>
        <NavigationLinkWrapper>
          {topics && topics.sections && renderArrow(item)}
          <NavigationLink
            active={isLinkActive({
              id: item.id,
              type: groupType,
            })}
            onClick={() => {
              chooseActive({
                id: item.id,
                type: groupType,
              })
            }}
          >
            {item.displayName}
          </NavigationLink>
        </NavigationLinkWrapper>
        {topics && topics.sections && (
          <NavigationSections
            items={topics.sections}
            groupType={groupType}
            rootId={item.id}
            activeContent={activeContent}
            activeNav={activeNav}
            activeNodes={activeNodes}
            setActiveNav={setActiveNav}
            chooseActive={chooseActive}
            isLinkActive={isLinkActive}
          />
        )}
      </NavigationItem>
    );
  };

  return (
    <NavigationContainer>
      {title && <NavigationHeader>{title}</NavigationHeader>}
      <NavigationItems showAll>
        {items.map(item => renderNavigationItem(item))}
      </NavigationItems>
    </NavigationContainer>
  );
}

export default NavigationGroup;

import React, { Component } from 'react';

import NavigationGroup from './NavigationGroup';
import { Wrapper } from './styled';

import { tokenize, makeUnique } from '../../../../commons/helpers';

class Navigation extends Component {
  state = {
    activeNodes: null,
  };

  render() {
    const isLinkActive = (() => {
      return ({ id, type }) => {
        const content = this.props.activeContent;
        return (
          tokenize(id) === tokenize(content.id) &&
          tokenize(type) === tokenize(content.type)
        );
      };
    })();

    const { chooseActive, rootItems, externalItems, docsLoaded } = this.props;

    if (!docsLoaded) {
      return null;
    }

    const externalNavigationSections = externalItems
      .map(item => item.groupName)
      .filter(makeUnique)
      .sort();

    return (
      <Wrapper>
        <NavigationGroup
          data-e2e-id="navigation-root"
          title="Root"
          icon="database"
          items={rootItems}
          groupType="root"
          isLinkActive={isLinkActive}
          chooseActive={chooseActive}
        />
        {externalNavigationSections &&
          externalNavigationSections.map(sectionName => {
            const dataForSection = externalItems.filter(
              elem => elem.groupName === sectionName,
            );
            const capitalizedName =
              sectionName[0].toUpperCase() + sectionName.slice(1);

            return (
              <NavigationGroup
                key={sectionName}
                data-e2e-id={`navigation-${sectionName}`}
                title={capitalizedName}
                icon={'Chart-Tree-Map'}
                items={dataForSection}
                groupType={sectionName}
                isLinkActive={isLinkActive}
                chooseActive={chooseActive}
              />
            );
          })}
      </Wrapper>
    );
  }
}

export default Navigation;

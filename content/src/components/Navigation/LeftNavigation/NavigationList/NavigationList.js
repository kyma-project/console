import React, { Component } from 'react';

import ScrollSpy from '../../ScrollSpy/ScrollSpy.component';
import NavigationGroup from './NavigationGroup';
import { Wrapper } from './styled';

import { SCROLL_SPY_ROOT_ELEMENT } from '../../../../commons/variables';
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

    const {
      activeNav,
      activeContent,
      chooseActive,
      setActiveNav,
      history,
      rootItems,
      externalItems,
      docsLoaded,
    } = this.props;
    const { activeNodes } = this.state;

    if (!docsLoaded) {
      return null;
    }

    const externalNavigationSections = externalItems
      .map(item => item.groupName)
      .filter(makeUnique)
      .sort((a, b) => (a === 'components' ? -1 : b === 'components' ? -1 : 0));

    if (activeNodes && activeNodes.document) {
      // console.log(
      //   activeNodes.document.id,
      //   activeNodes.groupOfDocuments.id,
      //   activeContent,
      // );
    }
    return (
      <ScrollSpy
        rootElement={`#${SCROLL_SPY_ROOT_ELEMENT}`}
        nodeTypes={['groupOfDocuments', 'document', 'header']}
        offset={{
          groupOfDocuments: 10,
          document: 10,
          header: 5,
        }}
        onUpdate={activeNodes => this.setState({ activeNodes })}
        activeContent={activeContent}
        docsLoadingStatus={{ docsLoadingStatus: docsLoaded }}
      >
        <Wrapper>
          <NavigationGroup
            data-e2e-id="navigation-root"
            title="Root"
            icon={'database'}
            items={rootItems}
            groupType="root"
            isLinkActive={isLinkActive}
            activeContent={activeContent}
            activeNav={activeNav}
            activeNodes={activeNodes}
            setActiveNav={setActiveNav}
            chooseActive={chooseActive}
            history={history}
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
                  activeContent={activeContent}
                  activeNav={activeNav}
                  activeNodes={activeNodes}
                  setActiveNav={setActiveNav}
                  chooseActive={chooseActive}
                  history={history}
                />
              );
            })}
        </Wrapper>
      </ScrollSpy>
    );
  }
}

export default Navigation;

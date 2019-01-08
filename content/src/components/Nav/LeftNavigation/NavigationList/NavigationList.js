import React, { Component } from "react";
import { Separator } from '@kyma-project/react-components';

import ScrollSpy from "../../ScrollSpy/ScrollSpy";
import NavigationGroup from "./NavigationGroup";
import { Wrapper } from "./styled";

import { SCROLL_SPY_ROOT_ELEMENT } from '../../../../commons/variables';
import { tokenize } from '../../../../commons/helpers';

// import { getDocsPath } from "../../../../../helpers/docsPath";
// import { tokenize } from "../../../../../helpers/tokenize";

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
      items,
      topics,
      activeNav,
      chooseActive,
      setActiveNav,
      history,
    } = this.props;
    const { activeNodes } = this.state;

    console.log(activeNodes)

    return (
      <ScrollSpy
        rootElement={`#${SCROLL_SPY_ROOT_ELEMENT}`}
        nodeTypes={["groupOfDocuments", "document", "header"]}
        offset={{
          groupOfDocuments: 40,
          document: 40,
          header: 40,
        }}
        onUpdate={activeNodes => this.setState({ activeNodes })}
      >
        <Wrapper>
          <NavigationGroup
            title=""
            items={[items.root]}
            topics={topics}
            groupType="root"
            isLinkActive={isLinkActive}
            activeNav={activeNav}
            activeNodes={activeNodes}
            setActiveNav={setActiveNav}
            chooseActive={chooseActive}
            history={history}
          />
          <Separator />
          <NavigationGroup
            title="Components"
            items={items.components}
            topics={topics}
            groupType="components"
            isLinkActive={isLinkActive}
            activeNav={activeNav}
            activeNodes={activeNodes}
            setActiveNav={setActiveNav}
            chooseActive={chooseActive}
            history={history}
          />
        </Wrapper>
      </ScrollSpy>
    );
  }
}

export default Navigation;

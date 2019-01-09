import React, { Component } from 'react';
import { ThemeWrapper } from '@kyma-project/react-components';

import DocsContent from '../DocsContent/DocsContent.container';
import LeftNavigation from '../Navigation/LeftNavigation/LeftNavigation';
import { 
  ColumnsWrapper,
  LeftSideWrapper,
  CenterSideWrapper,
} from './styled';

import { parseYaml } from '../../commons/yaml.js';
import { goToAnchor, goToTop } from 'react-scrollable-anchor';
import { SCROLL_SPY_ROOT_ELEMENT } from '../../commons/variables';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = this.setInitialState(props.match, props.location)
  }

  setInitialState = (match, location) => {
    const active = {
      id: match.params.id || this.getRoot(),
      type: match.params.type || 'root',
      hash: location.hash.replace(/#/g, ''),
    }

    return {
      activeContent: active,
      activeNav: active,
      navigationList: parseYaml(),
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { docsLoadingStatus: { docsLoadingStatus } } = this.props;
    const { activeContent } = this.state;
    const hash = activeContent.hash

    if (prevProps.docsLoadingStatus.docsLoadingStatus && !docsLoadingStatus) {
      if (hash) {
        goToAnchor(hash);
      }
    }


    if (activeContent && (prevState.activeContent.id !== activeContent.id)) {
      if (hash) {
        goToAnchor(hash);
      }
    }
  }

  getRoot = () => {
    const yaml = parseYaml();
    if (yaml && yaml.root) {
      return yaml.root.id;
    }
    return null;
  }

  chooseActive = (activeLink) => {
    const { props: { history }, state: { activeContent } } = this;
    
    if (activeContent.id !== activeLink.id) {
      this.setState({
        activeContent: activeLink,
        activeNav: activeLink,
      });
    }

    let link = `/${activeLink.type}/${activeLink.id}`;
    if (activeLink.hash) {
      link = `${link}#${activeLink.hash}`;
      history.push(link);
      goToAnchor(activeLink.hash);
    } else {
      history.push(link);
      goToTop();
    }
  }

  setActiveNav = (activeNav) => {
    if (
      JSON.stringify(activeNav) === JSON.stringify(this.state.activeNav) ||
      (activeNav.type === this.state.activeNav.type &&
        activeNav.id === this.state.activeNav.id &&
        !activeNav.hash)
    ) {
      this.colapseNav(activeNav);
    } else {
      this.expandNav(activeNav);
    }
  }

  expandNav = (activeNav) => {
    this.setState({
      activeNav: activeNav,
    });
  }

  colapseNav = (activeNav) => {
    const nav = activeNav.hash
      ? {
          id: activeNav.id,
          type: activeNav.type,
          hash: '',
        }
      : {
          id: '',
          type: '',
          hash: '',
        };

    this.setState({
      activeNav: nav,
    });
  }

  render() {
    const { history, topics } = this.props;
    const { activeContent, activeNav, navigationList } = this.state;
    
    return (
      <ThemeWrapper>
        <ColumnsWrapper>
          <LeftSideWrapper>
            <LeftNavigation 
              items={navigationList}
              topics={topics}
              activeContent={activeContent}
              activeNav={activeNav}
              chooseActive={this.chooseActive}
              setActiveNav={this.setActiveNav}
              history={history}
            />
          </LeftSideWrapper>
          <CenterSideWrapper id={SCROLL_SPY_ROOT_ELEMENT}>
            <DocsContent contentMetadata={activeContent} />
          </CenterSideWrapper>
        </ColumnsWrapper>
      </ThemeWrapper>
    );
  }
}

export default MainPage;

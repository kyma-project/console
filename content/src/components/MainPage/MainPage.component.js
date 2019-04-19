import React, { lazy, Suspense, Component } from 'react';
import { ThemeWrapper } from '@kyma-project/react-components';
import LeftNavigation from '../Navigation/LeftNavigation/LeftNavigation';
import { ColumnsWrapper, LeftSideWrapper, CenterSideWrapper } from './styled';

import { tokenize } from '../../commons/helpers';
import { goToAnchor, goToTop } from 'react-scrollable-anchor';
import { SCROLL_SPY_ROOT_ELEMENT } from '../../commons/variables';

const DocsContent = lazy(() => import('../DocsContent/DocsContent.container'));

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = this.setInitialState(props.match, props.location);
  }

  setInitialState = (match, location) => {
    const active = {
      id: match.params.id || this.getRoot(),
      type: match.params.type || 'root',
      hash: location.hash.replace(/#/g, ''),
    };

    return {
      activeContent: active,
      activeNav: active,
      docsList: this.getDocUrls(active.type, active.id),
      docsLoaded: false,
    };
  };

  componentDidUpdate(_, prevState) {
    const { docsLoaded } = this.state;

    const { activeContent } = this.state;
    const hash = activeContent.hash;

    if (!hash) {
      return null;
    }

    if (prevState.docsLoaded && !docsLoaded) {
      goToAnchor(hash);
    }

    if (activeContent && prevState.activeContent.id !== activeContent.id) {
      goToAnchor(hash);
    }
  }

  getDocUrls = (type, id) => {
    let docsItems =
      type === 'root'
        ? this.props.clusterDocsTopicsRoot || {}
        : this.props.clusterDocsTopicsComponents || {};
    if (!docsItems || !docsItems.length) return {};
    docsItems = docsItems.filter(
      item => tokenize(item.displayName) === id || item.name === id,
    );
    return docsItems[0] || {};
  };

  getRoot = () => {
    if (
      !this.props.clusterDocsTopicsRoot &&
      !this.props.clusterDocsTopicsRoot.length
    ) {
      return null;
    }
    return this.props.clusterDocsTopicsRoot[0].name;
  };

  chooseActive = activeLink => {
    const {
      props: { history },
      state: { activeContent },
    } = this;

    if (activeContent.id !== activeLink.id) {
      this.setState({
        activeContent: activeLink,
        activeNav: activeLink,
        docsList: this.getDocUrls(activeLink.type, activeLink.id),
      });
    } else {
      this.setState({
        activeContent: activeLink,
        activeNav: {
          id: activeLink.id,
          type: '',
          hash: '',
        },
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
  };

  setActiveNav = activeNav => {
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
  };

  expandNav = activeNav => {
    this.setState({
      activeNav: activeNav,
    });
  };

  setDocsInitialLoadStatus = () => {
    this.setState({
      docsLoaded: true,
    });
  };

  colapseNav = activeNav => {
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
  };

  render() {
    const { history } = this.props;
    const { activeContent, activeNav, docsList, docsLoaded } = this.state;

    const itemsComponents = this.props.clusterDocsTopicsComponents || {};
    const itemsRoot = this.props.clusterDocsTopicsRoot || {};

    return (
      <ThemeWrapper>
        <ColumnsWrapper>
          <LeftSideWrapper>
            <LeftNavigation
              rootItems={itemsRoot}
              externalItems={itemsComponents}
              activeContent={activeContent}
              activeNav={activeNav}
              chooseActive={this.chooseActive}
              docsLoaded={docsLoaded}
              setActiveNav={this.setActiveNav}
              history={history}
            />
          </LeftSideWrapper>
          <CenterSideWrapper id={SCROLL_SPY_ROOT_ELEMENT}>
            <Suspense fallback={<div>Loading...</div>}>
              <DocsContent
                docs={docsList}
                docsLoaded={docsLoaded}
                setDocsInitialLoadStatus={this.setDocsInitialLoadStatus}
              />
            </Suspense>
          </CenterSideWrapper>
        </ColumnsWrapper>
      </ThemeWrapper>
    );
  }
}

export default MainPage;

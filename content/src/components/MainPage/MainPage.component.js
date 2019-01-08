import React, { Component } from 'react';
import styled from 'styled-components';
import { ThemeWrapper, Toolbar } from '@kyma-project/react-components';
import ColumnsWrapper from '../ColumnsWrapper/ColumnsWrapper.component';
import ContentWrapper from '../ContentWrapper/ContentWrapper.container';
import NavigationList from '../Navigation/NavigationList.component';
import { parseYaml } from '../../commons/yaml.js';
import { goToAnchor, goToTop } from 'react-scrollable-anchor';

import DocsContent from '../DocsContent/DocsContent.container';

const LeftSideWrapper = styled.div`
  box-sizing: border-box;
  text-align: left;
  flex: 0 0 auto;
  position: fixed;
  height: 100%;
  width: 280px;
  bottom: 0;
  z-index: 1;
  overflow: auto;
  background-color: #fff;
  -webkit-transition: -webkit-transform 0.2s ease-in-out;
  transition: -webkit-transform 0.2s ease-in-out;
  transition: transform 0.2s ease-in-out;
  transition: transform 0.2s ease-in-out, -webkit-transform 0.2s ease-in-out;
  -webkit-box-shadow: 0 0 1px #ebebeb;
  box-shadow: 0 0 1px #ebebeb;
`;

const CenterSideWrapper = styled.div`
  box-sizing: border-box;
  max-width: 1272px;
  padding: 0 30px;
  padding-left: 311px;

  text-align: left;
  flex: 1 1 auto;
`;

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: {
        id: this.props.match.params.id || this.getRoot(),
        type: this.props.match.params.type || 'root',
        hash: this.props.location.hash.replace(/#/g, ''),
      },
      activeNav: {
        id: this.props.match.params.id || this.getRoot(),
        type: this.props.match.params.type || 'root',
        hash: this.props.location.hash.replace(/#/g, ''),
      },
      navigationList: parseYaml(),
    };
  }

  getRoot() {
    const yaml = parseYaml();
    if (yaml && yaml.root) {
      return yaml.root.id;
    }
    return null;
  }

  chooseActive(activeLink) {
    this.setState({
      active: activeLink,
      activeNav: activeLink,
    });
    let link = `/${activeLink.type}/${activeLink.id}`;
    if (activeLink.hash) {
      link = `${link}#${activeLink.hash}`;
      this.props.history.push(link);
      goToAnchor(activeLink.hash);
    } else {
      this.props.history.push(link);
      goToTop();
    }
  }

  setActiveNav(activeNav) {
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

  expandNav(activeNav) {
    this.setState({
      activeNav: activeNav,
    });
  }

  colapseNav(activeNav) {
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
    let topics = null;
    if (!this.props.topics.loading) {
      if (this.props.topics.topics) {
        topics = this.props.topics.topics;
      }
    }
    return (
      <ThemeWrapper>
        <div className="App">
          <ColumnsWrapper>
            <LeftSideWrapper>
              <Toolbar
                headline="Docs"
                addSeparator
                smallText
                back={() => {
                  this.props.history.goBack();
                }}
              />
              <NavigationList
                items={this.state.navigationList}
                topics={topics}
                active={this.state.active}
                activeNav={this.state.activeNav}
                callbackParent={newState => {
                  this.chooseActive(newState);
                }}
                setActiveNav={newState => {
                  this.setActiveNav(newState);
                }}
                history={this.props.history}
              />
            </LeftSideWrapper>
            <CenterSideWrapper>
              <DocsContent contentMetadata={this.state.active} />
            </CenterSideWrapper>
          </ColumnsWrapper>
        </div>
      </ThemeWrapper>
    );
  }
}

export default MainPage;

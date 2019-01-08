import React, { Component } from 'react';
import { ThemeWrapper, Toolbar } from '@kyma-project/react-components';

import NavigationList from '../Nav/NavigationList.component';
import { 
  LeftSideWrapper,
  CenterSideWrapper,
} from './styled';

import { parseYaml } from '../../commons/yaml.js';
import { goToAnchor, goToTop } from 'react-scrollable-anchor';

class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: {},
      activeNav: {},
      navigationList: {},
    };
  }

  componentDidMount() {
    const { match, location } = this.props;

    this.setState({
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
    })
  }

  getRoot = () => {
    const yaml = parseYaml();
    if (yaml && yaml.root) {
      return yaml.root.id;
    }
    return null;
  }

  chooseActive = (activeLink) => {
    const { history } = this.props;
    this.setState({
      active: activeLink,
      activeNav: activeLink,
    });

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
    let topics = null;
    if (!this.props.topics.loading && this.props.topics.topics) {
      topics = this.props.topics.topics;
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
              <ContentWrapper item={this.state.active} />
            </CenterSideWrapper>
          </ColumnsWrapper>
        </div>
      </ThemeWrapper>
    );
  }
}

export default MainPage;

import React from 'react';
import PropTypes from 'prop-types';

import { TabsWrapper, TabsHeader, TabsContent } from './components';

import Separator from '../Separator';

class Tabs extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    defaultActiveTabIndex: PropTypes.number,
  };

  static defaultProps = {
    defaultActiveTabIndex: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      children: []
        .concat(...this.props.children)
        .filter(child => child !== null && child !== undefined),
      activeTabIndex: this.props.defaultActiveTabIndex,
    };
  }

  handleTabClick = tabIndex => {
    this.setState({
      activeTabIndex: tabIndex,
    });
  };

  renderHeader = () => {
    return React.Children.map(this.state.children, (child, index) => {
      return React.cloneElement(child, {
        title: child.props.title,
        onClick: this.handleTabClick,
        tabIndex: index,
        isActive: index === this.state.activeTabIndex,
      });
    });
  };

  renderActiveTab = () => {
    if (this.state.children[this.state.activeTabIndex]) {
      return this.state.children[this.state.activeTabIndex].props.children;
    }
  };

  render() {
    return (
      <TabsWrapper>
        <TabsHeader>{this.renderHeader()}</TabsHeader>
        <Separator />
        <TabsContent>{this.renderActiveTab()}</TabsContent>
      </TabsWrapper>
    );
  }
}

export default Tabs;

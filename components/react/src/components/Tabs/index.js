import React from 'react';
import PropTypes from 'prop-types';

import {
  TabsWrapper,
  TabsHeader,
  TabsHeaderAdditionalContent,
  TabsContent,
} from './components';

import Separator from '../Separator';
import Tab from './Tab';

class Tabs extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    defaultActiveTabIndex: PropTypes.number,
    callback: PropTypes.func,
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

    if (typeof this.props.callback === 'function') {
      this.props.callback({
        defaultActiveTabIndex: tabIndex,
      });
    }
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

  renderAdditionalHeaderContent = () => {
    if (
      this.state.children[this.state.activeTabIndex] &&
      this.state.children[this.state.activeTabIndex].props.addHeaderContent
    ) {
      return this.state.children[this.state.activeTabIndex].props
        .addHeaderContent;
    }
  };

  renderActiveTab = () => {
    if (this.state.children[this.state.activeTabIndex]) {
      return this.state.children[this.state.activeTabIndex].props.children;
    }
  };

  render() {
    return (
      <TabsWrapper>
        <TabsHeader>
          {this.renderHeader()}
          <TabsHeaderAdditionalContent>
            {this.renderAdditionalHeaderContent()}
          </TabsHeaderAdditionalContent>
        </TabsHeader>
        <Separator />
        <TabsContent>{this.renderActiveTab()}</TabsContent>
      </TabsWrapper>
    );
  }
}

export default Tabs;

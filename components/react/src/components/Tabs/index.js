import React from 'react';
import PropTypes from 'prop-types';

import {
  TabsWrapper,
  TabsHeader,
  TabsHeaderAdditionalContent,
  TabsContent,
} from './components';

import Separator from '../Separator';

class Tabs extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    defaultActiveTabIndex: PropTypes.number,
    callback: PropTypes.func,
    border: PropTypes.bool,
    borderType: PropTypes.string,
    noMargin: PropTypes.bool,
    customStyles: PropTypes.bool,
    hideSeparator: PropTypes.bool,
  };

  static defaultProps = {
    defaultActiveTabIndex: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
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

  renderHeader = children => {
    return React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        title: child.props.title,
        onClick: this.handleTabClick,
        tabIndex: index,
        isActive: index === this.state.activeTabIndex,
      });
    });
  };

  renderAdditionalHeaderContent = children => {
    if (
      children[this.state.activeTabIndex] &&
      children[this.state.activeTabIndex].props.addHeaderContent
    ) {
      return children[this.state.activeTabIndex].props.addHeaderContent;
    }
  };

  renderActiveTab = children => {
    if (children[this.state.activeTabIndex]) {
      return children[this.state.activeTabIndex].props.children;
    }
  };

  getPropsFromActiveTab = children => {
    if (children[this.state.activeTabIndex]) {
      return children[this.state.activeTabIndex].props;
    }
  };

  borderType = statusType => {
    switch (statusType) {
      case 'top':
        return 'top';
      case 'bottom':
        return 'bottom';
      case 'none':
        return 'none';
      default:
        return 'bottom';
    }
  };

  render() {
    const children = []
      .concat(...this.props.children)
      .filter(child => child !== null && child !== undefined && child);

    const props = this.getPropsFromActiveTab(children);
    const currentBorderType = this.borderType(this.props.borderType);
    return (
      <TabsWrapper border={this.props.border} borderType={currentBorderType}>
        {!this.props.hideSeparator && currentBorderType === 'top' && (
          <Separator />
        )}
        <TabsHeader
          noMargin={this.props.noMargin}
          customStyles={this.props.customStyles}
        >
          {this.renderHeader(children)}
          <TabsHeaderAdditionalContent>
            {this.renderAdditionalHeaderContent(children)}
          </TabsHeaderAdditionalContent>
        </TabsHeader>
        {!this.props.hideSeparator && currentBorderType === 'bottom' && (
          <Separator />
        )}
        <TabsContent
          noMargin={props && props.noMargin}
          wrapInPanel={props.wrapInPanel}
        >
          {this.renderActiveTab(children)}
        </TabsContent>
      </TabsWrapper>
    );
  }
}

export default Tabs;

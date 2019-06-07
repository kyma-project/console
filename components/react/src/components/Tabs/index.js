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
    noBorder: PropTypes.bool,
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

  render() {
    const children = []
      .concat(...this.props.children)
      .filter(child => child !== null && child !== undefined && child);

    const props = this.getPropsFromActiveTab(children);

    return (
      <TabsWrapper border={this.props.border} noBorder={this.props.noBorder}>
        <TabsHeader
          noMargin={this.props.noMargin}
          customStyles={this.props.customStyles}
        >
          {this.renderHeader(children)}
          <TabsHeaderAdditionalContent>
            {this.renderAdditionalHeaderContent(children)}
          </TabsHeaderAdditionalContent>
        </TabsHeader>
        {!this.props.hideSeparator && <Separator />}
        <TabsContent noMargin={props && props.noMargin}>
          {this.renderActiveTab(children)}
        </TabsContent>
      </TabsWrapper>
    );
  }
}

export default Tabs;

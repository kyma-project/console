import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Tabs.scss';

export class Tabs extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    defaultActiveTabIndex: PropTypes.number,
    callback: PropTypes.func,
    customClass: PropTypes.string,
    hideSeparator: PropTypes.bool,
  };

  static defaultProps = {
    defaultActiveTabIndex: 0,
    callback: () => {},
    hideSeparator: true,
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
    this.props.callback(tabIndex);
  };

  renderHeader = children => {
    return React.Children.map(children, (child, index) =>
      React.cloneElement(child, {
        key: child.props.title,
        title: child.props.title,
        onClick: this.handleTabClick,
        tabIndex: index,
        isActive: index === this.state.activeTabIndex,
      }),
    );
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

    const tabClass = classNames('fd-tabs', this.props.customClass);
    const props = this.getPropsFromActiveTab(children);
    return (
      <div role="tablist">
        <div className={tabClass}>
          {this.renderHeader(children)}
          <div className="additionalContent">
            {this.renderAdditionalHeaderContent(children)}
          </div>
        </div>
        <div role="tabpanel">{this.renderActiveTab(children)}</div>
      </div>
    );
  }
}

import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

import { RelativeWrapper, DropdownWrapper } from './components';

class Dropdown extends React.Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
    name: PropTypes.string.isRequired,
    enabled: PropTypes.bool,
    firstButton: PropTypes.bool,
    lastButton: PropTypes.bool,
  };

  static defaultProps = {
    enabled: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  toggleDropdown = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  collapse = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { enabled, name, children, firstButton, lastButton } = this.props;
    const { visible } = this.state;

    const itemId = name
      ? name
          .split(' ')
          .join('-')
          .toLowerCase()
      : '';

    return (
      <RelativeWrapper onMouseLeave={this.collapse}>
        <Button
          normal
          padding={'8px 0 8px 16px'}
          first={firstButton}
          last={lastButton}
          onClick={this.toggleDropdown}
          disabled={!enabled}
          data-e2e-id={`toggle-${itemId}`}
        >
          {name}
        </Button>
        <DropdownWrapper visible={visible} data-e2e-id={`wrapper-${itemId}`}>
          {children}
        </DropdownWrapper>
      </RelativeWrapper>
    );
  }
}

export default Dropdown;

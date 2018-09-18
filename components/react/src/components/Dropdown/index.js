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
    marginTop: PropTypes.string,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    arrowTop: PropTypes.bool,
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
    const {
      enabled,
      name,
      children,
      firstButton,
      lastButton,
      marginTop,
      primary,
      secondary,
      arrowTop,
    } = this.props;
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
          padding={!primary && !secondary ? '8px 0 8px 16px' : '8px 16px'}
          first={firstButton}
          last={lastButton}
          marginTop={marginTop}
          primary={primary}
          secondary={secondary}
          onClick={this.toggleDropdown}
          disabled={!enabled}
          data-e2e-id={`toggle-${itemId}`}
        >
          {name}
        </Button>
        <DropdownWrapper
          visible={visible}
          arrowTop={arrowTop}
          data-e2e-id={`wrapper-${itemId}`}
        >
          {children}
        </DropdownWrapper>
      </RelativeWrapper>
    );
  }
}

export default Dropdown;

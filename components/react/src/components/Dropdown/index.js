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
    buttonWidth: PropTypes.string,
    marginTop: PropTypes.string,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    arrowTop: PropTypes.bool,
    arrowTopRight: PropTypes.string,
  };

  static defaultProps = {
    enabled: true,
  };

  constructor(props) {
    super(props);
    this.node = React.createRef();
    this.state = {
      visible: false,
    };
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClickOutside, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside, false);
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

  handleClickOutside = e => {
    if (this.node.contains(e.target)) {
      return;
    }
    this.collapse();
  };

  render() {
    const {
      enabled,
      name,
      children,
      firstButton,
      lastButton,
      buttonWidth,
      marginTop,
      primary,
      secondary,
      arrowTop,
      arrowTopRight,
    } = this.props;
    const { visible } = this.state;
    const itemId = name
      ? name
          .split(' ')
          .join('-')
          .toLowerCase()
      : '';

    return (
      <RelativeWrapper innerRef={node => (this.node = node)}>
        <Button
          normal
          width={buttonWidth}
          padding={
            buttonWidth
              ? '9px 0'
              : !primary && !secondary
                ? '9px 0 9px 16px'
                : '9px 16px'
          }
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
          arrowTopRight={arrowTopRight}
          data-e2e-id={`wrapper-${itemId}`}
        >
          {children}
        </DropdownWrapper>
      </RelativeWrapper>
    );
  }
}

export default Dropdown;

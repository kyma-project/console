import React, { Component } from 'react';
// import React, { useContext } from "react";
import styled from 'styled-components';

import { CopyToClipboard } from 'react-copy-to-clipboard';

// import PopupState from "@common/state/usePopup";

import Icon from '../../../Icon';
import Tooltip from '../../../Tooltip';

const CopyButtonWrapper = styled.div`
  user-select: none;
`;

const StyledIcon = styled(Icon)`
  cursor: pointer;
  width: 28px;
  min-width: 28px;
  height: 28px;
  min-height: 28px;
  padding: 7px 8px 5px;
  border-radius: 100%;
  box-shadow: 0 0 6px 0 rgba(137, 165, 199, 0.42);
  background-color: #fff;
  color: #c9c9c9;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: #0073e6;
  }
`;

const ConfirmationWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
`;

const CONFIRMATION_VISIBILITY_TIME = 1500;

class CopyButton extends Component {
  constructor(props) {
    super(props);
    this.timeout = null;

    this.state = {
      showConfirmation: false,
    };
  }

  toggleConfirmation = confirmation => {
    this.setState({
      showConfirmation: !confirmation,
    });
  };

  render() {
    const { code, className = '' } = this.props;
    const showConfirmation = this.state.showConfirmation;
    const tooltipDescription = 'Click to copy';
    const copyPopupDescription = 'Copied to clipboard';
    return (
      <CopyButtonWrapper className={className}>
        <Tooltip content={tooltipDescription} orientation={'bottom'}>
          <CopyToClipboard
            text={code}
            onCopy={() => {
              alert(copyPopupDescription);
              // setPopup(copyPopupDescription);
            }}
          >
            <span>
              <StyledIcon glyph="copy" />
            </span>
          </CopyToClipboard>
        </Tooltip>
        {showConfirmation && (
          <ConfirmationWrapper>{copyPopupDescription}</ConfirmationWrapper>
        )}
      </CopyButtonWrapper>
    );
  }
}

export default CopyButton;

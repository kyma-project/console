import React, { Component } from 'react';
import styled from 'styled-components';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Icon, Tooltip } from '@kyma-project/react-components';

const CopyButtonWrapper = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  user-select: none;
  z-index: 100;
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
  box-sizing: border-box;
  z-index: 99;
  min-width: 120px;
  max-width: 420px;
  background: #32363a;
  font-size: 12px;
  line-height: 12px;
  color: #fff;
  filter: drop-shadow(rgba(0, 0, 0, 0.12) 0 0px 2px);
  box-shadow: 0 0 4px 0 #00000026, 0 12px 20px 0 #00000019;
  border-radius: 3px;
  padding: 6px 10px;
  font-weight: bold;
`;

const CONFIRMATION_VISIBILITY_TIME = 2000;

export interface CopyButtonProps {
  code: string;
  className: string;
}

export interface CopyButtonState {
  showConfirmation: boolean;
}

export class CopyButton extends Component<CopyButtonProps, CopyButtonState> {
  timeout: any;

  constructor(props: CopyButtonProps) {
    super(props);
    this.timeout = null;

    this.state = {
      showConfirmation: false,
    };
  }

  toggleConfirmation = (showConfirmation: boolean) => {
    this.setState({
      showConfirmation,
    });
  };

  scheduleHideConfirmation() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.toggleConfirmation(false);
    }, CONFIRMATION_VISIBILITY_TIME);
  }

  render() {
    const { code, className = '' } = this.props;
    const showConfirmation = this.state.showConfirmation;
    const tooltipDescription = 'Click to copy';
    const copyPopupDescription = 'Copied to clipboard';
    if (showConfirmation) {
      this.scheduleHideConfirmation();
    }
    return (
      <CopyButtonWrapper className={className}>
        <Tooltip content={tooltipDescription} orientation={'bottom'}>
          <CopyToClipboard
            text={code}
            onCopy={() => {
              this.toggleConfirmation(true);
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

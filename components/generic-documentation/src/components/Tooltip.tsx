import React from 'react';

import {
  TooltipWrapper,
  TooltipContainer,
  TooltipContent,
  TooltipHeader,
} from './styled';

interface TooltipProps {
  title?: any;
  content: any;
  minWidth?: string;
  maxWidth?: string;
  type?: string;
  showTooltipTimeout?: number;
  hideTooltipTimeout?: number;
  orientation?: string;
  wrapperStyles?: string;
}

interface TooltipState {
  visibleTooltip: boolean;
  showTooltip: boolean;
}

export class Tooltip extends React.Component<TooltipProps, TooltipState> {
  static defaultProps = {
    orientation: 'top',
  };

  constructor(props: any) {
    super(props);
    this.state = {
      visibleTooltip: props.show === undefined ? false : props.show,
      showTooltip: props.show === undefined ? false : props.show,
    };
  }

  setVisibility = (visible: boolean) => {
    this.setState({ visibleTooltip: visible });
  };

  handleShowTooltip = () => {
    const { showTooltipTimeout } = this.props;
    if (typeof this.setVisibility === 'function' && !this.state.showTooltip) {
      setTimeout(
        () => this.setVisibility(true),
        showTooltipTimeout ? showTooltipTimeout : 100,
      );
    }
  };

  handleHideTooltip = () => {
    const { hideTooltipTimeout } = this.props;
    if (typeof this.setVisibility === 'function' && !this.state.showTooltip) {
      setTimeout(
        () => this.setVisibility(false),
        hideTooltipTimeout ? hideTooltipTimeout : 100,
      );
    }
  };

  render() {
    const { visibleTooltip, showTooltip } = this.state;
    const {
      children,
      title,
      content,
      minWidth,
      maxWidth,
      type,
      orientation,
      wrapperStyles,
    } = this.props;

    return (
      <TooltipWrapper
        onMouseEnter={this.handleShowTooltip}
        onMouseLeave={this.handleHideTooltip}
        type={type === undefined ? 'default' : type}
        wrapperStyles={wrapperStyles}
      >
        {children}
        {visibleTooltip && content && (
          <TooltipContainer
            minWidth={minWidth}
            maxWidth={maxWidth}
            type={type === undefined ? 'default' : type}
            show={showTooltip}
            orientation={orientation}
          >
            {title && (
              <TooltipHeader type={type === undefined ? 'default' : type}>
                {title}
              </TooltipHeader>
            )}
            <TooltipContent type={type === undefined ? 'default' : type}>
              {content}
            </TooltipContent>
          </TooltipContainer>
        )}
      </TooltipWrapper>
    );
  }
}

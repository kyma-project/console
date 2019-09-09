import React, { useState } from 'react';

import {
  TooltipWrapper,
  TooltipContainer,
  TooltipContent,
  TooltipHeader,
} from './styled';

export enum TooltipType {
  STANDARD = '',
  LIGHT = 'light',
  INFO = 'info',
  POSITIVE = 'positive',
  WARNING = 'warning',
  NEGATIVE = 'negative',
}

export enum TooltipOrientation {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export interface TooltipProps {
  title?: React.ReactNode;
  content: React.ReactNode;
  minWidth?: string;
  maxWidth?: string;
  type?: TooltipType;
  show?: boolean;
  showTooltipTimeout?: number;
  hideTooltipTimeout?: number;
  orientation?: TooltipOrientation;
  wrapperStyles?: string;
}

export const Tooltip: React.FunctionComponent<TooltipProps> = ({
  title,
  content,
  minWidth,
  maxWidth,
  type = TooltipType.STANDARD,
  show = false,
  showTooltipTimeout = 100,
  hideTooltipTimeout = 100,
  orientation = TooltipOrientation.TOP,
  wrapperStyles,
  children,
}) => {
  const [visibleTooltip, setVisibleTooltip] = useState<boolean>(false);

  const handleShowTooltip = () => {
    if (!show) {
      setTimeout(() => setVisibleTooltip(true), showTooltipTimeout);
    }
  };

  const handleHideTooltip = () => {
    if (!show) {
      setTimeout(() => setVisibleTooltip(false), hideTooltipTimeout);
    }
  };

  return (
    <TooltipWrapper
      onMouseEnter={handleShowTooltip}
      onMouseLeave={handleHideTooltip}
      type={type}
      wrapperStyles={wrapperStyles}
    >
      {children}
      {visibleTooltip && content && (
        <TooltipContainer
          minWidth={minWidth}
          maxWidth={maxWidth}
          type={type}
          show={show}
          orientation={orientation}
        >
          {title && <TooltipHeader type={type}>{title}</TooltipHeader>}
          <TooltipContent type={type}>{content}</TooltipContent>
        </TooltipContainer>
      )}
    </TooltipWrapper>
  );
};

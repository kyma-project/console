import { css } from 'styled-components';

export const customScrollBar = ({
  scrollbarWidth = '6px',
  scrollbarHeight = '6px',
  thumbColor = '#d4d4d4',
  thumbBorderRadius = '0',
  trackColor = '#f1f1f1',
  trackBorderRadius = '0',
}) => css`
  &::-webkit-scrollbar {
    width: ${scrollbarWidth};
    height: ${scrollbarHeight};
  }
  &::-webkit-scrollbar-thumb {
    background: ${thumbColor};
    border-radius: ${thumbBorderRadius};
  }
  &::-webkit-scrollbar-track {
    background: ${trackColor};
    border-radius: ${trackBorderRadius};
  }
`;

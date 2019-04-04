import { css } from 'styled-components';

export const sizes = {
  giant: 1200,
  desktop: 1024,
  tablet: 768,
  phone: 375,
};

export const media = {
  micro: (...args) => css`
    @media (max-width: ${sizes.phone - 1}px) {
      ${css(...args)};
    }
  `,
  phone: (...args) => css`
    @media (min-width: ${sizes.phone}px) and (max-width: ${sizes.tablet -
        1}px) {
      ${css(...args)};
    }
  `,
  tablet: (...args) => css`
    @media (min-width: ${sizes.tablet}px) and (max-width: ${sizes.desktop -
        1}px) {
      ${css(...args)};
    }
  `,
  desktop: (...args) => css`
    @media (min-width: ${sizes.desktop}px) and (max-width: ${sizes.giant -
        1}px) {
      ${css(...args)};
    }
  `,
  giant: (...args) => css`
    @media (min-width: ${sizes.giant}px) {
      ${css(...args)};
    }
  `,
};

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

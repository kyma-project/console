import styled, { css } from 'styled-components';
import { media } from '@kyma-project/components';
import { Icon } from 'fundamental-react';

const navNode = (multiple: number) => css`
  span {
    right: 5px;
  }

  a {
    padding-left: ${`${12 + multiple * 12}px`};
  }
`;

export const HeadersNavigationsWrapper = styled.div`
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 100vh;
  height: 100%;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(151, 151, 151, 0.26);
  border-image: initial;
  border-radius: 4px;

  ${media.phone`
    display: none;
  `}
`;

export const StyledHeadersNavigation = styled.div`
  &&& {
    border-radius: 4px;
    background-color: rgb(255, 255, 255);

    .cms__toc-list-item {
      width: 100%;
      max-width: 100%;
      position: relative;

      a {
        width: 100%;
        font-size: 13px;
        padding: 4px 24px;
        color: #32363a;
        font-weight: normal;

        &.active {
          color: #0b74de;
          font-weight: bold;
          border-left: 2px solid #0b74de;
        }
      }

      ul {
        display: none;
      }
    }

    .cms__toc-list-item--active {
      > a {
        color: #0b74de;
        font-weight: bold;
        border-left: 2px solid #0b74de;
      }
    }

    .cms__toc-list-item--level-1 {
      ${navNode(0)}
    }

    .cms__toc-list-item--level-2 {
      ${navNode(1)}
    }

    .cms__toc-list-item--level-3 {
      ${navNode(2)}
    }

    .cms__toc-list-item--level-4 {
      ${navNode(3)}
    }

    .cms__toc-list-item--level-5 {
      ${navNode(4)}
    }

    .cms__toc-list-item--level-6 {
      ${navNode(5)}
    }

    .cms__toc-list-item--level-doc-title {
      ${navNode(0)}

      .cms__toc-list-item--level-1 {
        ${navNode(1)}
      }

      .cms__toc-list-item--level-2 {
        ${navNode(2)}
      }

      .cms__toc-list-item--level-3 {
        ${navNode(3)}
      }

      .cms__toc-list-item--level-4 {
        ${navNode(4)}
      }

      .cms__toc-list-item--level-5 {
        ${navNode(5)}
      }

      .cms__toc-list-item--level-6 {
        ${navNode(6)}
      }
    }

    .cms__toc-list-item--level-doc-type {
      ${navNode(0)}

      .cms__toc-list-item--level-doc-title {
        ${navNode(1)}
      }

      .cms__toc-list-item--level-1 {
        ${navNode(2)}
      }

      .cms__toc-list-item--level-2 {
        ${navNode(3)}
      }

      .cms__toc-list-item--level-3 {
        ${navNode(4)}
      }

      .cms__toc-list-item--level-4 {
        ${navNode(5)}
      }

      .cms__toc-list-item--level-5 {
        ${navNode(6)}
      }

      .cms__toc-list-item--level-6 {
        ${navNode(7)}
      }
    }

    .cms__toc-list-item--show,
    .cms__toc-list-item--show > ul {
      display: block !important;
    }
  }
`;

interface CollapseArrowProps {
  open: boolean;
  root: boolean;
}

export const CollapseArrow = styled(Icon)`
  &&&&& {
    display: block;
    position: absolute;
    width: 18px;
    ${({ root = false }: CollapseArrowProps) =>
      root ? `margin-left: 5px;` : ''}
    top: 2px;
    text-align: center;
    cursor: pointer;
    color: #0b74de;

    &:before {
      font-size: 0.65rem;
      line-height: 1;
      transition: 0.3s ease;
      ${({ open = false }: CollapseArrowProps) =>
        open && 'transform: rotate(90deg);'};
    }
  }
`;

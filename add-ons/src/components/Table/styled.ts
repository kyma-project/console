import styled from 'styled-components';
import { Token, Panel } from 'fundamental-react';

export const ErrorWrapper = styled.div`
  padding: 16px;
  font-size: 22px;
  font-weight: 500;
  text-align: center;
`;

export const PanelWrapper = styled.div`
  margin: 32px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.15);

  &&& {
    .fd-button--light {
      margin-left: 6px;
    }

    .fd-tree--header {
      background-color: rgba(243, 244, 245, 0.45);
    }

    .fd-tree__row--header {
      font-size: 11px;
      background-color: rgba(243, 244, 245, 0.45);
    }

    .fd-tree__row--header .fd-tree__col {
      padding-top: 12px;
      padding-bottom: 12px;

      button {
        top: 10px;
        height: 19px;
      }
    }

    .fd-panel__body {
      padding: 0;
    }

    .fd-tree > .fd-tree__item > .fd-tree__row > {
      .fd-tree__col {
        align-self: flex-start;
      }

      .fd-tree__col--control {
        line-height: 26px;

        button {
          top: 12px;
          height: 19px;
        }

        .fd-tree__col--control--default-config {
          display: inline-block;
          margin-right: 9px;
        }
      }
    }

    .fd-tree__group--sublevel-1 .fd-tree__col--control {
      padding-left: 30px;
    }

    .fd-tree > .fd-tree__item {
      border-bottom: 1px solid #eeeeef;
    }

    .fd-tree > .fd-tree__item:last-child {
      border-bottom: 0;
    }

    .fd-tree__col {
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .fd-tree__col--control > div {
      font-weight: bold;
    }

    .fd-tree__row--header .fd-tree__col--control > div {
      font-weight: 400;
    }

    .add-ons-url {
      padding: 3px 0;
    }
  }
`;

export const StyledTokensWrapper = styled.div`
  margin-top: -6px;

  button {
    margin-top: 6px;
  }
`;

export const StyledToken = styled(Token)`
  &&& {
    background: #eef5fc;
    margin: 6px 6px 0 0;
  }
`;

export const Label = styled(Token)`
  &&& {
    background: #eef5fc;
    cursor: pointer;
    margin: 6px 6px 0 0;

    &:after {
      content: '';
      margin-left: 0;
    }
  }
`;

export const Labels = styled.div`
  margin-top: -6px;
`;

export const TreeViewColActions = styled.div`
  float: right;

  > .sap-icon--delete {
    cursor: pointer;
    color: #bb0000;
    margin-left: 6px;
  }
`;

export const NoAvailableLabelsText = styled.span`
  display: block;
  margin: 6px 6px 0 0;
`;

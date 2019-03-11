import { css } from 'styled-components';

export const asyncApiConfig = {
  disableDefaultTheme: true,
};

export const asyncApiTheme = {
  asyncApiWrapper: css`
    font-family: '72';
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased;
  `,
  header: css``,
  headerParagraph: css``,
  h1: css``,
  h2: css``,
  h3: css``,
  h4: css``,
  h5: css``,
  h6: css``,
  hrefHeader: css`
    color: #0b74de;
  `,
  markdown: css`
    > div {
      > ul {
        margin: 0;
        padding-left: 16px;
        list-style-type: disc;
      }
      > p {
        margin: 0;
        > code {
          display: inline-block;
          width: auto;
          font-weight: bold;
          font-size: 10px;
          line-height: 14px;
          border-radius: 3px;
          padding: 0px 5px;
          text-align: center;
          background: #e2eaf2;
          color: #18873d;
        }
      }
      h2,
      h3,
      h4 {
        margin: 18px 0;
        font-weight: bold;
      }
      h2 {
        font-size: 20px;
      }
      h3 {
        font-size: 18px;
      }
      h4 {
        font-size: 16px;
      }
    }
  `,
  table: css`
    margin: 0 0 20px 0;
    width: 100%;
    border-spacing: 0;
    font-size: 13px;
  `,
  tableHeader: css`
    width: 100%;
    color: #939698;
    background: #f9fafa;
    text-transform: uppercase;
  `,
  tableHeaderTitle: css`
    line-height: 30px;
  `,
  tableHeaderRow: css`
    font-weight: lighter;
    font-size: 11px;
  `,
  tableHeaderCell: css`
    padding: 12px 20px;
    text-align: left;
    font-weight: bold;
  `,
  tableBody: css`
    color: #000;
  `,
  tableBodyRow: css`
    background: #fff;

    &:nth-child(even) {
      background: #fff;
    }
  `,
  tableBodyRowWithNested: css`
    background: #fff !important;

    > td > div {
      display: block;
      padding: 0px;
      max-height: 0;
      overflow: hidden;
      transition: all 1s ease;
    }
  `,
  tableBodyCell: css`
    font-size: 13px !important;
    padding: 12px 20px;
    vertical-align: top;
    border-bottom: 1px solid #efeff0;
    white-space: normal !important;
    word-wrap: normal !important;

    > p {
      margin-top: 0;
    }
  `,
  tableBodyCellWithNested: css`
    padding: 0;
    vertical-align: middle;
  `,
  tableNested: css`
    margin: 10px 10px 10px auto;
    width: calc(100% - 45px);
    background: #f9fafa !important;
    border-spacing: 0;
    font-size: 13px;
    border-collapse: separate;
    border-radius: 5px;
    border: solid 1px #d4d4d4;
  `,
  tableHeaderNested: css`
    color: #939698;
    border-bottom: solid 1px #d4d4d4;
    font-weight: bold;
    text-align: left;
    padding: 6px 0;
    font-size: 12px;
  `,
  tableHeaderTitleNested: css`
    color: #939698;
    background-color: inherit;

    > td {
      border-bottom: solid 1px #d4d4d4;
      padding: 8px 20px;
      font-size: 12px;
      color: #818487;
      font-weight: bold;
    }
  `,
  tableHeaderRowNested: css`
    color: #939698;
  `,
  tableHeaderCellNested: css`
    background: #f9fafa;
    width: 20%;
    padding: 8px 20px;
    font-size: 12px;
    border-bottom: solid 1px #d4d4d4;
    font-weight: bold;
  `,
  tableBodyNested: css`
    color: #000;
  `,
  tableBodyRowNested: css`
    color: #333;
    border-bottom: solid 1px #d4d4d4;

    &:last-child {
      > td {
        border-bottom: none;
      }
    }
  `,
  tableBodyCellNested: css`
    padding: 8px 20px;
    vertical-align: top;
    font-size: 13px;
    border-bottom: solid 1px #d4d4d4;
    white-space: normal;
    word-wrap: normal;
  `,
  treeSpace: css`
    display: inline-block;
    width: 20px;
  `,
  treeLeaf: css`
    display: inline-block;
    position: relative;
    width: 25px;

    &:before {
      content: '';
      position: absolute;
      top: -15px;
      width: 13px;
      height: 10px;
      border-left: #aaa 2px solid;
      border-bottom: #aaa 2px solid;
      border-radius: 0 0 0 70%;
    }
  `,
  badge: css`
    display: inline-block;
    font-weight: bold;
    font-size: 11px;
    line-height: 18px;
    border-radius: 3px;
    padding: 0px 5px;
    text-align: center;
    text-transform: uppercase;
    background: #e2eaf2;
  `,
  publishBadge: css`
    color: #18873d;
  `,
  subscribeBadge: css`
    color: #107ee3;
  `,
  deprecatedBadge: css`
    margin-left: 10px;
    color: #f59702;
  `,
  requiredBadge: css`
    font-size: 9px;
    line-height: 14px;
    color: #f59702;
    border-radius: 3px;
    margin-left: 10px;
  `,
  generatedBadge: css`
    font-size: 9px;
    line-height: 14px;
    color: #18873d;
    border-radius: 3px;
    margin-left: 10px;
  `,
  tag: css`
    display: inline-block;
    mix-blend-mode: multiply;
    border-radius: 4px;
    background-color: #e2eaf2;
    font-size: 11px;
    font-family: 72;
    font-weight: 300;
    text-transform: uppercase;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #73787d;
    padding: 3px 8px;
    margin: 0 5px 0 0;
  `,
  codeWrapper: css`
    border: 1px solid #e4e4e4;
    border-radius: 5px;
    background: #fff;
  `,
  codeHeader: css`
    padding: 12px 20px;
    border-bottom: 1px solid #e4e4e4;

    > h4 {
      margin: 0;
      color: #32363a;
      font-size: 13px;
      font-weight: bold;
    }
  `,
  codeContentWrapper: css`
    margin: 0;
    font-size: 13px;
  `,
  codeContent: css`
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace !important;
    margin: 0 !important;
    padding: 8px 15px !important;
    background: #fff !important;
    font-size: 12px !important;
    border-bottom-left-radius: 5px !important;
    border-bottom-right-radius: 5px !important;
    color: #0b74de;
  `,
  info: css`
    background: #fff;
    border-radius: 5px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  `,
  infoHeader: css`
    > h1 {
      margin-top: 0;
      font-weight: bold;
      margin-bottom: 20px;
      font-size: 24px;
    }

    > div > h2 {
      font-size: 20px;
      font-weight: bold;
      margin: 16px 0;
    }
  `,
  contact: css`
    margin-top: 24px;
  `,
  contactHeader: css`
    > h2 {
      margin: 0 0 18px 0;
      font-size: 20px;
      font-weight: bold;
    }
  `,
  contactList: css`
    margin: 0;
    padding-left: 16px;
    list-style-type: disc;

    > li > strong {
      font-weight: bold;
    }
  `,
  license: css`
    margin-top: 24px;
  `,
  licenseHeader: css`
    > h2 {
      margin: 0 0 18px 0;
      font-size: 20px;
      font-weight: bold;
    }
  `,
  licenseList: css`
    margin: 0;
    padding-left: 16px;
    list-style-type: disc;

    > li > strong {
      font-weight: bold;
    }
  `,
  servers: css`
    margin-top: 24px;
    > table {
      margin-bottom: 0;
    }
  `,
  serverExpandIcon: css`
    display: inline-block;
    position: relative;
    width: 10px;
    height: 10px;
    margin-right: 10px;
    transform-origin: 50% 50%;
    transition: 0.5s ease;
    cursor: pointer;

    &:before {
      content: '\uE066';
      font-family: SAP-icons;
      position: absolute;
      color: #0071d4;
      font-size: 12px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `,
  serversHeader: css`
    > h2 {
      margin: 0 0 18px 0;
      font-size: 20px;
      font-weight: bold;
    }
  `,
  serverVariablesEnumList: css`
    margin: 0 0 0 15px;
    padding: 0;
    list-style-type: disc;
  `,
  serverVariablesEnumElement: css``,
  topics: css`
    margin-top: 24px;
    background: #fff;
    border-radius: 5px;
  `,
  topicsHeader: css`
    > h2 {
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: bold;
    }
  `,
  topic: css`
    margin-bottom: 24px;
    padding-left: 18px;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      border: 3px solid #0071d4;
      border-radius: 100%;
      left: 0;
      top: 6px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  `,
  topicHeader: css`
    > h3 {
      color: #0b74de;
      font-size: 15px;
      margin: 15px 0;
      font-weight: bold;
    }
  `,
  topicHeaderBadge: css`
    display: block;
    float: left;
    margin-top: -2px;
    margin-right: 10px;
  `,
  topicMessage: css`
    > div {
      padding-left: 0;

      &:before {
        border: none;
        border-radius: 0;
        left: 0;
        top: 0;
      }
    }
  `,
  topicHeaderMessage: css`
    color: #32363a;

    > h4 {
      margin: 16px 0;
      font-weight: bold;
    }
  `,
  parameters: css`
    margin-bottom: 24px;
  `,
  parametersHeader: css`
    color: #32363a;

    > h4 {
      margin: 0 0 16px 0;
      font-weight: bold;
    }
  `,
  parameter: css`
    margin-bottom: 24px;
    padding-left: 18px;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      border: 3px solid #0071d4;
      border-radius: 100%;
      left: 0;
      top: 6px;
    }

    &:last-child {
      margin-bottom: 0;
    }

    > div {
      padding-left: 0;

      > table {
        margin-top: 20px;
      }

      &:before {
        border: none;
        border-radius: 0;
        left: 0;
        top: 0;
      }
    }
  `,
  parameterHeader: css`
    > h4 {
      margin: 0 0 12px 0;
      font-weight: bold;
    }
  `,
  messages: css`
    margin-top: 24px;
    background: #fff;
    border-radius: 5px;
  `,
  messagesHeader: css`
    > h2 {
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: bold;
    }
  `,
  message: css`
    margin-bottom: 24px;
    padding-left: 18px;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      border: 3px solid #0071d4;
      border-radius: 100%;
      left: 0;
      top: 6px;
    }

    &:last-child {
      margin-bottom: 0;
    }

    > div > div {
      padding-left: 0;

      &:before {
        border: none;
        border-radius: 0;
        left: 0;
        top: 0;
      }
    }
  `,
  messageIndented: css``,
  messageHeader: css`
    > h3 {
      color: #0b74de;
      font-size: 15px;
      font-weight: bold;
      margin: 0 0 16px 0;
    }
  `,
  messageHeaders: css`
    margin: 20px 0;
  `,
  messageHeadersHeader: css`
    color: #32363a;

    > h4 {
      margin: 0 0 8px 0;
      font-weight: bold;
    }
  `,
  messagePayload: css`
    margin: 20px 0;
  `,
  messagePayloadHeader: css`
    color: #32363a;

    > h4 {
      margin: 0 0 8px 0;
      font-weight: bold;
    }
  `,
  messageTags: css`
    margin: 20px 0;
  `,
  messageTagsHeader: css`
    color: #32363a;

    > h4 {
      margin: 0 0 8px 0;
      font-weight: bold;
    }
  `,
  schemas: css`
    margin-top: 24px;
    background: #fff;
    border-radius: 5px;
  `,
  schemasHeader: css`
    > h2 {
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: bold;
    }
  `,
  schema: css`
    margin-bottom: 24px;
    padding-left: 18px;
    position: relative;

    &:before {
      content: '';
      position: absolute;
      border: 3px solid #0071d4;
      border-radius: 100%;
      left: 0;
      top: 6px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  `,
  schemaHeader: css`
    > h4 {
      color: #0b74de;
      font-size: 15px;
      margin: 0 0 8px 0;
      font-weight: bold;
    }
  `,
  schemaExample: css``,
  security: css`
    margin-top: 24px;
    background: #fff;
    border-radius: 5px;

    > table {
      margin: 0;
    }
  `,
  securityHeader: css`
    > h2 {
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: bold;
    }
  `,
};

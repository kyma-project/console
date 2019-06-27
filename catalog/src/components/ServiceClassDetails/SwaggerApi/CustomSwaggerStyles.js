import styled, { css } from 'styled-components';
import contentTypeSelect from './assets/content-type-select-background-image.png';
import schemesSelect from './assets/schemes-background-image.png';
import responsesSelect from './assets/responsesSelect.png';

const summaries = css`
  && {
    div.opblock-summary {
      border-bottom: none;
      padding: 4px 10px;
      min-height: 48px;
    }
  }

  span.opblock-summary-method {
    min-width: 86px;
  }

  /* http methods + deprecated */
  div.opblock-summary.opblock-summary-post > span.opblock-summary-method {
    background-color: #ebfaf4;
    color: rgb(73, 204, 144);
  }

  div.opblock-summary.opblock-summary-put > span.opblock-summary-method {
    background-color: #fef7f1;
    color: #fca130;
  }

  div.opblock-summary.opblock-summary-get > span.opblock-summary-method {
    background-color: #eef5fc;
    color: #0a6dd1;
  }

  div.opblock-summary.opblock-summary-delete > span.opblock-summary-method {
    background-color: #fae7e7;
    color: #f93e3e;
  }

  div.opblock-summary.opblock-summary-patch > span.opblock-summary-method {
    background-color: #edfcf9;
    color: #50e3c2;
  }

  div.opblock-summary.opblock-summary-options > span.opblock-summary-method {
    background-color: #e6eef6;
    color: #0e5aa7;
  }

  div.opblock-summary.opblock-summary-head > span.opblock-summary-method {
    background-color: #f3e6ff;
    color: #902afe;
  }

  div.opblock.opblock-deprecated
    > div.opblock-summary
    > span.opblock-summary-method {
    background-color: #eeeeef;
    color: #74777a;
  }
`;

const tagHeader = css`
  h4.opblock-tag {
    border-bottom: none;
    a.nostyle {
      font-family: '72';
      font-size: 14px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.43;
      letter-spacing: normal;
      color: #32363a;
      text-transform: capitalize;
    }
    small {
      font-family: '72';
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.43;
      letter-spacing: normal;
      color: #6a6d70;
    }
    div > small {
      display: none;
    }
  }

  label[for='schemes'] > select {
    /* background-image: linear-gradient(45deg, transparent 50%, #0a6ed1 50%),
        linear-gradient(135deg, #0a6ed1 50%, transparent 50%)
      background-position: calc(100% - 19px) calc(1em + 2px),
        calc(100% - 14px) calc(1em + 2px), calc(100% - 2.7em) 0em;
      background-size: 5px 5px, 5px 5px, 1px 4em;
      background-repeat: no-repeat; */
    min-width: 100px;
    background-image: url(${schemesSelect});
    background-size: 25px 25px;
    background-position-x: 100%;
  }
`;

const sectionHeader = css`
  div.opblock-section-header {
    padding-left: 16px;
    box-shadow: none;
    border-top: solid 1px rgba(151, 151, 151, 0.26);
    background-color: #fafafa;
    h4.opblock-title {
      font-family: '72';
      font-size: 14px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.43;
      letter-spacing: normal;
      color: #32363a;
    }

    label {
      div.content-type-wrapper.execute-content-type > select {
        min-width: unset;
        font-family: '72';
        font-size: 14px;
        line-height: 1.43;
        letter-spacing: normal;
        color: #0a6ed1;
        border: none;
        box-shadow: none;
        background-image: url(${responsesSelect});
        background-size: 23px;
        background-position-x: 85%;
      }

      span {
        font-family: '72';
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.43;
        letter-spacing: normal;
        color: #6a6d70;
      }
    }
  }
`;

const paramOptions = css`
  div.body-param-options {
    label > span {
      display: inline-block;
      margin-top: 8px;
      margin-bottom: 8px;
      font-family: '72';
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.29;
      letter-spacing: normal;
      line-height: 1.29;
      letter-spacing: normal;
      color: #32363a;
    }
    div.body-param-content-type > select.content-type {
      width: unset;
      font-family: '72';
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.43;
      letter-spacing: normal;
      line-height: 1.43;
      letter-spacing: normal;
      color: rgb(130, 133, 136);

      box-shadow: none;
      border: solid 1px #b1b6bc;
      -webkit-appearance: none;
      -moz-appearance: none;
      -ms-appearance: none;
      -o-appearance: none;
      appearance: none;
      background: url(${contentTypeSelect});
      background-position-x: 100%;
      background-size: 34px 34px;
      background-repeat: no-repeat;
      /* background-image: linear-gradient(45deg, transparent 50%, #0a6ed1 50%),
        linear-gradient(135deg, #0a6ed1 50%, transparent 50%),
        linear-gradient(to right, #ccc, #ccc);
      background-position: calc(100% - 19px) calc(1em + 2px),
        calc(100% - 14px) calc(1em + 2px), calc(100% - 2.7em) 0em;
      background-size: 5px 5px, 5px 5px, 1px 4em;
      background-repeat: no-repeat; */
    }
  }
`;

const paramTable = css`
  ${paramOptions}
  div.table-container {
    padding: 0;
    table.parameters {
      thead > tr {
        background-color: rgba(243, 244, 245, 0.45);
        border-top: solid 1px rgba(151, 151, 151, 0.26);
        th {
          padding: 13px 16px;
          border: none;
          opacity: 0.6;
          font-family: '72';
          font-size: 11px;
          line-height: 1.18;
          color: #32363a;
          text-transform: uppercase;
        }
      }
      tbody > tr {
        td {
          div.parameter__name.required {
            color: #3b4151;
            font-family: '72';
            padding-left: 15px;
          }
          div.parameter__in {
            padding-left: 15px;
          }
        }
      }
    }

    td.col.parameters-col_description div.markdown {
      font-family: '72';
      font-size: 14px;

      line-height: 1.29;
      letter-spacing: normal;
      color: #000000;
      margin-bottom: 15px;
    }
    td.col.parameters-col_description div:not(.markdown) {
      ul.tab {
        margin-top: 11px;
        border-radius: 4px 4px 0 0;
        margin-bottom: 0;
        padding: 10px 0;
        border: solid 1px #89919a;
        & > li {
          padding-left: 10px;
          &:after {
            display: none;
          }
          a {
            font-family: '72';
            font-size: 14px;

            line-height: 1.29;
            letter-spacing: normal;
            color: #74777a;
          }
        }
      }

      ul.tab > li.tabitem.active > a {
        color: #32363a;
      }
    }

    div.highlight-code {
      & > pre {
        border-radius: 0 0 4px 4px;
        border: solid 1px #89919a;
        border-top: none;
        background-color: #fafafa;
        & > span {
          font-family: Courier;
          font-size: 14px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;
          line-height: normal;
          letter-spacing: normal;
          /* original style has !important too, so we need this to override */
          color: #3f5060 !important;
        }
      }
    }
  }
`;

const responsesTable = css`
  div.responses-wrapper {
    div.responses-inner {
      padding: 0px;
      table.responses-table {
        padding-left: 10px;
        thead {
          background-color: rgba(243, 244, 245, 0.45);
          tr > td {
            padding-left: 16px;
            border-bottom: none;
            padding-top: 13px;
            opacity: 0.6;
            font-family: '72';
            font-size: 11px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.18;
            letter-spacing: normal;
            color: #32363a;
            text-transform: uppercase;
          }
        }
        tbody {
          tr.response {
            td.col {
              padding-left: 16px;
            }
            td.col:first-child {
              font-family: '72';
              font-size: 14px;
              font-weight: bold;
              font-style: normal;
              font-stretch: normal;
              line-height: 1.29;
              letter-spacing: normal;
              color: #000000;
            }
            div.markdown {
              border-radius: 4px;
              border: solid 1px #89919a;
              background-color: #fafafa;
              font-family: Courier;
              font-size: 14px;
              font-weight: normal;
              font-style: normal;
              font-stretch: normal;
              line-height: normal;
              letter-spacing: normal;
              color: #32363a;
            }
          }
        }
      }
    }
  }
`;

const StyledSwagger = styled.section`
  && {
    span.schemes-title {
      display: none;
    }

    div.scheme-container {
      margin: 0;
      padding: 0;
      box-shadow: none;
    }

    ${tagHeader};
    ${sectionHeader};
    div.opblock {
      box-shadow: none;
      background-color: white;
      border: solid 1px rgba(151, 151, 151, 0.26);
    }

    div.table-container {
      padding: 15px;
    }

    ${summaries};
    ${paramTable};
    ${responsesTable};
  }
`;

export { StyledSwagger };

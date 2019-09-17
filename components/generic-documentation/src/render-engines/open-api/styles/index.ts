import styled, { css } from 'styled-components';
import contentTypeSelect from './assets/content-type-select-background-image.png';
import schemesSelect from './assets/schemes-background-image.png';
import responsesSelect from './assets/responsesSelect.png';

const summaries = css`
  && {
    div.opblock-summary {
      border-bottom: none;
      padding: 4px 16px;
      min-height: 48px;
      & > span.opblock-summary-path > a {
        font-family: '72';
        font-size: 14px;
        font-weight: bold;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.43;
        letter-spacing: normal;
        color: #32363a;
      }
      & > div.opblock-summary-description {
        font-family: '72';
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.43;
        letter-spacing: normal;
        color: #74777a;
      }
    }
  }

  span.opblock-summary-method {
    min-width: 86px;
    padding: 4px 16px;
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
        background-color: transparent;
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
    }
  }
`;

const modelTableInnerStyling = css`
  ul.tab {
    margin-top: 11px;
    border-radius: 4px 4px 0 0;
    margin-bottom: 0;
    padding: 10px 0;
    border: solid 1px #89919a;
    width: 100%;
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
  ul.tab + div {
    & > div.model-box {
      width: 100%;
      border-radius: 0 0 4px 4px;
      border: 1px solid #89919a;
      border-top: none;
      background: none;
      > span.model > div > section:nth-child(2) {
        padding: 10px;
      }
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
          div.parameter__name {
            padding-left: 15px;
            font-family: '72';
            font-size: 14px;
            font-weight: bold;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.29;
            letter-spacing: normal;
            color: #000000;
          }

          div.parameter__type {
            font-family: '72';
            font-size: 14px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.43;
            letter-spacing: normal;
            color: #515559;
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
      ${modelTableInnerStyling}
    }
  }

  td.col.response-col_description div:not(.markdown) {
    ${modelTableInnerStyling}
  }
  div.highlight-code {
    & > pre {
      border-radius: 0 0 4px 4px;
      border: solid 1px #89919a;
      border-top: none;
      background-color: #fafafa;
      width: 100%;
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
              vertical-align: middle;
            }
            div.response-col_description__inner > div.markdown {
              width: 100%;
              padding: 10px 15px;
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
              > p {
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
            table.headers {
              thead > tr.header-row > th.header-col {
                font-family: '72';
                font-size: 14px;
                font-weight: normal;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.43;
                letter-spacing: normal;
                color: #32363a;
              }
              tbody > tr > td.header-col {
                font-family: '72';
                font-size: 13px;
                font-weight: normal;
                font-style: normal;
                font-stretch: normal;
                line-height: 1.43;
                letter-spacing: normal;
                color: #32363a;
              }
            }
            .response-col_description {
              padding: 16px;
            }
          }
        }
      }
    }
  }
`;

const modelSectionStyles = css`
  section.models {
    box-shadow: inset 0 1px 0 0 #eeeeef;
    background-color: #ffffff;
    padding-bottom: 0;

    /* common */
    div.model-container {
      margin: 0;
      background: none;

      border-bottom: 1px solid #eeeeef;
    }
    span.model.model-title {
      font-family: '72';
      font-size: 14px;
      font-weight: bold;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.43;
      letter-spacing: normal;
      color: #32363a;
    }
    /* collapsed */
    div.model-container > div.model-box > section {
      justify-content: space-between;
    }
    div.model-container > div.model-box {
      padding: 0 10px;
    }

    /* dropped down */
    div.model-container > span.model-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: white;
      /* padding: 0; */
      & > div.model-box {
        width: 100%;
        padding: 0 0 10px 10px;
        span.model-title > span.model-title__text {
          font-family: '72';
          font-size: 14px;
          font-weight: bold;
          font-style: normal;
          font-stretch: normal;
          line-height: 1.43;
          letter-spacing: normal;
          color: #32363a;
          padding-bottom: 10px;
        }
        & > span.model > div {
          & > section:first-child {
            justify-content: space-between;
            margin-bottom: 10px;
          }
          & > section:nth-child(2) {
            padding: 14px 20px;
            margin-right: 10px;
            & > span.inner-object > table.model > tbody > tr > td {
              &,
              & span {
                font-family: Courier;
                font-size: 14px;
                font-weight: normal;
                font-style: normal;
                font-stretch: normal;
                line-height: normal;
                letter-spacing: normal;
                /* color: #3f5060; */
              }
            }
          }
        }
      }
    }
  }
`;

export const StyledSwagger = styled.section`
  background: #fff;
  padding: 16px;
  border-style: solid;
  border-color: rgba(151, 151, 151, 0.26);
  border-image: initial;
  border-radius: 4px;

  && {
    > div.swagger-ui > div > div.wrapper {
      padding: 0;
    }

    .wrapper {
      max-width: 100%;
      padding: 0 16px;
    }

    section.models {
      margin-bottom: 0;
    }

    span.schemes-title {
      display: none;
    }

    div.scheme-container {
      margin: 0;
      padding: 0 0 10px 0;
      box-shadow: none;
      border-bottom: 1px solid #efeff0;

      > span {
        padding: 0 16px;

        .schemes.wrapper.block {
          padding-right: 0;
        }
      }
    }

    ${tagHeader};
    ${sectionHeader};

    div.opblock {
      box-shadow: none;
      background-color: white;
      border: solid 1px rgba(151, 151, 151, 0.26);
      margin: 0 0 16px;
    }

    div.table-container {
      padding: 15px;
    }

    ${summaries};
    ${paramTable};
    ${responsesTable};
    ${modelSectionStyles};

    .models h4 {
      padding: 10px 20px;
    }

    .opblock-tag-section > div > span:last-child > div {
      margin: 0;
    }
  }
`;

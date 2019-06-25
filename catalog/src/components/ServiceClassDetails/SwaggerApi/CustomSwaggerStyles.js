import styled from 'styled-components';

const StyledSwagger = styled.section`
  span.schemes-title {
    display: none;
  }
  div.scheme-container {
    margin: 0;
    padding: 0;
    box-shadow: none;
  }
  && {
    div.opblock {
      box-shadow: none;
      background-color: white;
      border: solid 1px rgba(151, 151, 151, 0.26);
    }
  }
  div.opblock-summary {
    min-height: 48px;
  }
  && {
    h4.opblock-tag {
      border-bottom: none;
    }
  }
  && {
    div.opblock-section-header {
      border-top: solid 1px rgba(151, 151, 151, 0.26);
      background-color: #fafafa;
    }
    div.opblock-section-header h4.opblock-title {
      font-family: '72';
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.43;
      letter-spacing: normal;
      color: #32363a;
    }

    div.table-container {
      padding: 15px;
    }

    table.parameters > thead > tr > th {
      padding-top: 5px;
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

    td.col.parameters-col_description div.markdown {
      font-family: '72';
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.29;
      letter-spacing: normal;
      color: #000000;
    }
    td.col.parameters-col_description div:not(.markdown) {
      ul.tab > li {
        padding-left: 10px;
        &:after {
          display: none;
        }
        a {
          font-family: '72';
          font-size: 14px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;
          line-height: 1.29;
          letter-spacing: normal;
          color: #74777a;
        }
      }

      ul.tab > li.tabitem.active > a {
        color: #32363a;
      }

      /* color: #32363a; */
    }

    div.opblock-summary {
      border-bottom: none;
      padding: 4px 10px;
    }

    span.opblock-summary-method {
      min-width: 86px;
    }

    && {
      div.opblock-summary {
        border-bottom: none;
      }
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
  }
`;

export { StyledSwagger };

/*
patch #edfcf9 #50e3c2
options #0e5aa7 #e6eef6
head #902afe #f3e6ff
*/

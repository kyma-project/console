import styled from 'styled-components';

export const Markdown = styled.div`
  max-width: 899px;
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: '72';
    color: #32363a;
    font-weight: bold;
  }
  h1 {
    font-size: 23px;
    margin: 26px 0;
  }
  h2 {
    font-size: 16px;
    margin: 16px 0;
  }
  h3 {
    font-size: 14px;
    margin: 8px 0;
  }
  a {
    text-decoration: none;
    font-family: '72';
    color: #0b74de;
  }
  a:hover {
    color: #0b74de;
    text-decoration: underline;
  }
  code {
    width: 100%;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
  }
  .internal {
    display: none !important;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 30px 0;
  }
  thead {
    background-color: rgba(243, 244, 245, 0.45);
  }
  th,
  td {
    font-weight: normal;
    text-align: left;
    color: #32363a;
    border: none;
    outline: none;
  }
  th {
    padding: 14px 20px;
    font-size: 11px;
    opacity: 0.6;
    text-transform: uppercase;
    line-height: 1.18;
  }
  tr {
    border-bottom: 1px solid rgba(56, 70, 84, 0.25);
  }
  tr:last-child {
    border: none;
  }
  td {
    font-size: 14px;
    line-height: 1.29;
    text-align: left;
    padding: 15px 20px;
    color: #32363a;
    font-weight: normal;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
  }
  img {
    max-width: 100%;
  }
  blockquote {
    margin: 24px 0;
    border-radius: 4px;
    position: relative;
    border-left: solid 6px #0b74de;
    background-color: #ffffff;
    font-family: '72';
    font-size: 13px;
    -webkit-margin-start: 0;
    -webkit-margin-end: 0;
  }
  blockquote:before {
    content: '\uE01F';
    display: block;
    position: absolute;
    top: 10px;
    right: 12px;
    padding: 0;
    z-index: 10;
    color: #0b74de;
    font-family: 'SAP-icons';
    font-size: 13px;
  }
  blockquote p {
    font-weight: normal;
    border: solid 1px rgba(151, 151, 151, 0.26);
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    padding: 0 20px 11px;
    line-height: 1.31;
  }
  blockquote p strong:first-child {
    display: block;
    margin: 0 -20px 12px;
    padding: 11px 20px;
    border-bottom: solid 1px rgba(151, 151, 151, 0.26);
    font-weight: bold;
  }
  ul,
  ol {
    padding-left: 32px;
  }
  ul:last-child,
  ol:last-child,
  p:last-child {
    margin-bottom: 12px;
  }
  ul {
    list-style-type: disc;
    list-style-position: outside;
  }
  ol {
    list-style-type: decimal;
    list-style-position: outside;
  }
  div[tabs] ul {
    padding: 0;
    list-style-type: none;
  }
  ul ul,
  ol ul {
    list-style-type: circle;
    list-style-position: outside;
  }
  ol ol,
  ul ol {
    list-style-type: lower-latin;
    list-style-position: outside;
  }
  code {
    border-radius: 3px;
    background-color: #f9fafa;
    color: #0b74de;
    padding: 3px 4px;
  }
  pre code {
    display: block;
    width: 100%;
    position: relative;
    box-sizing: border-box;
    overflow-x: auto;
    background-color: #ffffff;
    border: solid 1px rgba(151, 151, 151, 0.26);
    padding: 48px 13px 13px;
  }
  pre code:before {
    display: block;
    position: absolute;
    content: 'Code';
    box-sizing: border-box;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    padding: 12px 20px;
    color: #32363a;
    font-family: '72';
    font-size: 13px;
    line-height: 1.19;
    font-weight: bold;
    border-bottom: solid 1px rgba(151, 151, 151, 0.26);
  }
  pre code:after {
    content: '\uE03C';
    display: block;
    position: absolute;
    top: 9px;
    right: 11px;
    padding: 0;
    z-index: 10;
    color: #0b74de;
    font-family: 'SAP-icons';
    font-size: 13px;
  }
`;

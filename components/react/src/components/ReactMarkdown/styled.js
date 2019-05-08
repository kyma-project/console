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

  ul,
  ol {
    padding-left: 32px;
  }

  ul:last-child,
  ol:last-child,
  p:last-child {
    margin-bottom: 12px;
  }

  blockquote p:last-child {
    margin-bottom: 0;
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

  pre {
    margin: 0;
  }
`;

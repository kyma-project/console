import styled from 'styled-components';

export const LinkButton = styled.span`
  color: #0b74de;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
`;

export const Link = styled.a`
  cursor: pointer;
  text-decoration: none !important;
`;

export const ServiceClassButton = styled.span`
  color: #0a6ed1;
`;

export const AddServiceRedirectButton = styled.button`
  padding: 0;
  background: none;
  border: 0;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.21;
  letter-spacing: normal;
  text-align: right;
  margin-right: 0;
  color: #0a6ed1;
  opacity: 1;
  text-decoration: none;
  cursor: pointer;
`;

export const ServicePlanButton = ServiceClassButton;

export const JSONCode = styled.code`
  width: 100%;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
`;

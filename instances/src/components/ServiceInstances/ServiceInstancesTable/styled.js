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
  cursor: pointer;
`;

export const AddServiceInstanceRedirectButton = styled.button`
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

export const ServicePlanButton = styled.span`
  padding: 0;
  background: none;
  border: 0;
  text-align: left;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.21;
  letter-spacing: normal;
  margin-right: 0;
  color: #0a6ed1;
  opacity: 1;
  text-decoration: none;
  cursor: pointer;
`;

export const JSONCode = styled.code`
  width: 100%;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
`;

export const DeleteButtonWrapper = styled.div`
  text-align: right;
  display: block;
`;

export const TextOverflowWrapper = styled.div`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

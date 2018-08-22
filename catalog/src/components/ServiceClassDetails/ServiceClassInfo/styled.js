import styled from 'styled-components';
import { media } from '@kyma-project/react-components';

export const ServiceClassInfoContentWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  align-items: flex-start;
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  ${props => (props.phoneRows ? media.phone`flex-flow: column nowrap;` : '')};
`;

export const ImagePlaceholder = styled.div`
  position: relative;
  width: 90px;
  height: 90px;
  min-width: 90px;
  min-height: 90px;
  margin-right: 20px;
  line-height: 90px;
  text-align: center;
  border-radius: 4px;
  background-color: #fff;
  border: solid 1px rgba(63, 80, 96, 0.15);
  color: #32363a;
  font-size: 32px;
`;

export const Image = styled.img`
  max-width: 40px;
  max-height: 40px;
  position: absolute;
  margin: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const ServiceTitle = styled.h3`
  font-family: '72';
  font-size: 16px;
  font-weight: normal;
  color: #32363a;
  margin: 0;
`;

export const ServiceProvider = styled.p`
  font-family: '72';
  font-size: 14px;
  font-weight: 300;
  color: #b2b9bf;
  margin: 5px 0;
`;

export const DocsLink = styled.a`
  font-family: '72';
  font-size: 14px;
  font-weight: normal;
`;

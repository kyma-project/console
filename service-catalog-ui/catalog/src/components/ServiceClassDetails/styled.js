import styled from 'styled-components';
import { media } from '@kyma-project/react-components';

export const ServiceClassDetailsWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  align-items: flex-start;
  padding: 0;
  display: flex;
  flex-flow: row nowrap;
  ${props => (props.phoneRows ? media.phone`flex-flow: column nowrap;` : '')};
`;

export const EmptyList = styled.div`
  width: 100%;
  font-family: '72';
  text-align: center;
  font-size: 20px;
  color: #32363a;
  padding: 30px;
`;

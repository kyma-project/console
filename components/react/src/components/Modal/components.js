import styled from 'styled-components';

export const ModalWrapper = styled.div`
  text-align: ${props => props.align};
`;

export const ModalHeader = styled.header`
  font-family: '72';
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  text-align: left;
  color: #32363a;
  padding: 16px;
  overflow: hidden;
  border-bottom: 1px solid rgba(204, 204, 204, 0.3);
  position: relative > p {
    display: inline-block;
    margin-right: 35px;
  }
`;

export const ModalAdditionalContent = styled.div`
  font-family: '72';
  height: auto;
  padding: 22px 16px 16px 16px;
  border-bottom: 1px solid rgba(204, 204, 204, 0.3);
`;

export const ModalContent = styled.div`
  font-family: '72';
  font-size: 14px;
  padding: 16px 16px;
  height: auto;
  min-height: 120xp;
  max-height: 360px;
  overflow: auto;
  flex-grow: 1;
`;

export const ModalFooter = styled.footer`
  border-top: ${props =>
    props.borderFooter ? '1px solid rgba(204, 204, 204, 0.3)' : 'none'};
  padding: 16px;
  text-align: right;
`;

export const ModalCloseButton = styled.button`
  text-decoration: none;
  cursor: pointer;
  outline: 0;
  border: 0;
  font-family: 'SAP-icons';
  font-size: 16px;
  text-align: left;
  color: #32363a;
  display: inline-block;
  position: absolute;
  top: 15px;
  right: 16px;
  padding: 0;
`;

import styled from 'styled-components';

export const FormFieldsetWrapper = styled.div`
  legend {
    margin: 12px 0;
    font-size: 12px;
    font-weight: 500;
    color: rgba(63, 80, 96, 0.6);
    text-transform: uppercase;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

export const StyledGroup = styled.div`
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

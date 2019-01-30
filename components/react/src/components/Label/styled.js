import styled from 'styled-components';
import { Token } from 'fundamental-react';

export const LabelWrapper = styled.div`
    cursor: ${props => props.cursorType ? props.cursorType : "auto"};
`;

export const Label = styled(Token)`
    && {
        transition: 0.3s background-color ease-in-out;

        &:hover {
            background-color: #e2effd;
        }

        &:after, &:before {
            content: "";
            margin-left: 0;
        }
    }
`;
 
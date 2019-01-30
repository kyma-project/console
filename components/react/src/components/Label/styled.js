import styled from 'styled-components';
import { Token } from 'fundamental-react';

export const LabelWrapper = styled.div`
    && {
        .fd-token {
            cursor: ${props => props.cursorType ? props.cursorType : "cursor"};
        }
    }
`;

export const Label = styled(Token)`
    && {
        transition: 0.125s background-color ease-in-out;

        &:hover {
            background-color: #e2effd;
        }

        &:after, &:before {
            content: "";
            margin-left: 0;
        }
    }
`;
 
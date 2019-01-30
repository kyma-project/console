import React from 'react';
import { LabelWrapper, Label } from './styled';

export default ({ children, cursorType }) => { console.log(cursorType); return (
    <LabelWrapper cursorType={cursorType}>
        <Label>{children}</Label>
    </LabelWrapper>
)};

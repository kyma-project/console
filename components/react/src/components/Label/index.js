import React from 'react';
import { LabelWrapper, Label } from './styled';

export default ({ children, cursorType }) => (
    <LabelWrapper cursorType={cursorType}>
        <Label>{children}</Label>
    </LabelWrapper>
);

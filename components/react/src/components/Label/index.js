import React from 'react';
import { LabelWrapper, Label } from './styled';

export default ({ children, cursorType, ...props }) => (
  <LabelWrapper cursorType={cursorType}>
    <Label {...props}>{children}</Label>
  </LabelWrapper>
);

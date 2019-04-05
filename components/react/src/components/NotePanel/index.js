import React from 'react';

import { NotePanelWrapper, NotePanelContent } from './styled';

const NotePanel = ({ type, children }) => (
  <NotePanelWrapper type={type}>
    <NotePanelContent>{children}</NotePanelContent>
  </NotePanelWrapper>
);

export default NotePanel;

import React from 'react';

import { Panel, PanelBody } from 'fundamental-react';

import { Wrapper } from './styled';

const BackendModuleDisabled = ({ mod }) => (
  <Wrapper>
    <Panel>
      <PanelBody>{`${mod} backend module is disabled.`}</PanelBody>
    </Panel>
  </Wrapper>
);

export default BackendModuleDisabled;

import React from 'react';

import { Panel } from 'fundamental-react';

import { Wrapper } from './styled';

const BackendModuleDisabled = ({ mod }) => (
  <Wrapper>
    <Panel>
      <Panel.Body>{`${mod} backend module is disabled.`}</Panel.Body>
    </Panel>
  </Wrapper>
);

export default BackendModuleDisabled;

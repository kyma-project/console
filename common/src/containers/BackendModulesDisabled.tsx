import React from 'react';
import styled from 'styled-components';
import { Panel } from 'fundamental-react';

import { BackendModules } from '../services';

export const Wrapper = styled.div`
  width: 100%;
  text-align: center;
  font-size: 20px;
  padding: 30px;
`;

interface Props {
  backendModules: BackendModules[];
  requiredBackendModules: BackendModules[];
}

export const BackendModulesDisabled: React.FunctionComponent<Props> = ({
  backendModules = [],
  requiredBackendModules = [],
}) => {
  const modules = requiredBackendModules.filter(
    reqMod => !backendModules.includes(reqMod),
  );

  const modulesLength = modules.length;
  if (!modulesLength) {
    return null;
  }

  const capitalize = (str: string): string =>
    `${str[0].toUpperCase()}${str.slice(1)}`;

  const text =
    modulesLength === 1
      ? `${capitalize(modules[0])} backend module is disabled.`
      : `${modules.map((mod, index) =>
          index ? ` ${capitalize(mod)}` : capitalize(mod),
        )} backend modules is disabled.`;

  return (
    <Wrapper>
      <Panel>
        <Panel.Body>{text}</Panel.Body>
      </Panel>
    </Wrapper>
  );
};

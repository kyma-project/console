import React from 'react';
import { ActionBar, Button } from 'fundamental-react';

import AddNewConfigurationModal from '../Modals/AddNewConfigurationModal/AddNewConfigurationModal.container';

import { CORE } from '../../constants';

import appInitializer from '../../core/app-initializer';
import { StyledActionBar } from './styled';

const Toolbar: React.FunctionComponent = () => {
  const currentNamespace = appInitializer.getCurrentNamespace();
  const title = currentNamespace
    ? CORE.ADD_ONS_CONFIGURATION_TITLE
    : CORE.CLUSTER_ADD_ONS_CONFIGURATION_TITLE;
  const description = currentNamespace
    ? CORE.ADD_ONS_CONFIGURATION_DESCRIPTION
    : CORE.CLUSTER_ADD_ONS_CONFIGURATION_DESCRIPTION;

  return (
    <StyledActionBar>
      <ActionBar.Header title={title} description={description} />
      <ActionBar.Actions>
        <AddNewConfigurationModal />
      </ActionBar.Actions>
    </StyledActionBar>
  );
};

export default Toolbar;

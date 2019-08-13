import React, { useContext } from 'react';
import { ActionBar } from 'fundamental-react';
import { GlobalService } from '@kyma-project/common';

import AddNewConfigurationModal from '../Modals/AddNewConfigurationModal/AddNewConfigurationModal.container';

import { CORE } from '../../constants';
import { StyledActionBar } from './styled';

const Toolbar: React.FunctionComponent = () => {
  const { currentNamespace } = useContext(GlobalService);
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

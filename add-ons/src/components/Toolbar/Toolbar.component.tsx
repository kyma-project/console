import React from 'react';
import { ActionBar } from 'fundamental-react';
import { LuigiContext } from './../../services/LuigiContext.service';

import AddNewConfigurationModal from '../Modals/AddNewConfigurationModal/AddNewConfigurationModal.container';

import { CORE } from '../../constants';
import { StyledActionBar } from './styled';
import * as ReactShared from '../../react-shared';

const Toolbar: React.FunctionComponent = () => {
  const { namespaceId: currentNamespace } = React.useContext(LuigiContext);
  const title = currentNamespace
    ? CORE.ADD_ONS_CONFIGURATION_TITLE
    : CORE.CLUSTER_ADD_ONS_CONFIGURATION_TITLE;
  const description = currentNamespace
    ? CORE.ADD_ONS_CONFIGURATION_DESCRIPTION
    : CORE.CLUSTER_ADD_ONS_CONFIGURATION_DESCRIPTION;

  ReactShared.useWindowTitle(
    currentNamespace
      ? CORE.SHORT_ADD_ONS_CONFIGURATION_TITLE
      : CORE.SHORT_CLUSTER_ADD_ONS_CONFIGURATION_TITLE,
  );

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

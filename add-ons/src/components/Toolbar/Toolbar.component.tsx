import React from 'react';
import { ActionBar, Button } from 'fundamental-react';

import AddNewConfigurationModal from '../Modals/AddNewConfigurationModal/AddNewConfigurationModal.container';

import { CORE } from '../../constants';

import { StyledActionBar } from './styled';

const Toolbar: React.FunctionComponent = () => {
  return (
    <StyledActionBar>
      <ActionBar.Header title={CORE.ADD_ONS_CONFIGURATION} />
      <ActionBar.Actions>
        <AddNewConfigurationModal />
      </ActionBar.Actions>
    </StyledActionBar>
  );
};

export default Toolbar;

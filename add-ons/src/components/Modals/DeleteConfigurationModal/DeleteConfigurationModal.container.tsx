import React, { useContext } from 'react';

import MutationsService from '../../../services/Mutations.service';
import DeleteConfigurationModal from './DeleteConfigurationModal.component';

interface Props {
  configurationName: string;
}

export const DeleteConfigurationModalContainer: React.FunctionComponent<
  Props
> = ({ configurationName }) => {
  const { deleteAddonsConfiguration } = useContext(MutationsService.Context);

  const handleDelete = () => {
    deleteAddonsConfiguration({ variables: { name: configurationName } });
  };

  return (
    <DeleteConfigurationModal
      configurationName={configurationName}
      handleDelete={handleDelete}
    />
  );
};

export default DeleteConfigurationModalContainer;

import React, { useContext } from 'react';

import { MutationsService } from '../../../services';
import DeleteConfigurationModal from './DeleteConfigurationModal.component';

interface Props {
  configurationName: string;
}

const DeleteConfigurationModalContainer: React.FunctionComponent<Props> = ({
  configurationName,
}) => {
  const { deleteAddonsConfiguration } = useContext(MutationsService);

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

import React, { useContext } from 'react';

import { MutationsService } from '../../../services';
import DeleteConfigurationModal from './DeleteUrlModal.component';

import { DeleteUrlModalWrapper } from './styled';

interface Props {
  configurationName: string;
  url: string;
}

const DeleteUrlModalContainer: React.FunctionComponent<Props> = ({
  configurationName,
  url,
}) => {
  const { removeAddonsConfigurationUrls } = useContext(
    MutationsService,
  );

  const handleDelete = () => {
    removeAddonsConfigurationUrls({
      variables: {
        name: configurationName,
        urls: [url],
      },
    });
  };

  return (
    <DeleteUrlModalWrapper>
      <DeleteConfigurationModal
        configurationName={configurationName}
        url={url}
        handleDelete={handleDelete}
      />
    </DeleteUrlModalWrapper>
  );
};

export default DeleteUrlModalContainer;

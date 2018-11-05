import React from 'react';

import { InformationModal } from '@kyma-project/react-components';

import { JSONCode } from './styled';

const ParametersDataModal = ({ title, data, modalOpeningComponent }) => {
  return (
    <InformationModal
      title={title}
      content={<JSONCode>{JSON.stringify(data, undefined, 2)}</JSONCode>}
      modalOpeningComponent={modalOpeningComponent}
    />
  );
};

export default ParametersDataModal;

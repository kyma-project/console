import React from 'react';

import { Icon, Tooltip } from '@kyma-project/react-components';

import { InfoButtonWrapper } from './styled';

const InfoButton = ({ content }) => {
  return (
    <InfoButtonWrapper>
      <Tooltip
        content={content}
        orientation={'top'}
        minWidth={'320px'}
        type="light"
      >
        <Icon icon={'\ue1c4'} />
      </Tooltip>
    </InfoButtonWrapper>
  );
};

export default InfoButton;

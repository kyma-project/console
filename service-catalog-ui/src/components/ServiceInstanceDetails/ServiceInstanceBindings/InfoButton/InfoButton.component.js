import React from 'react';

import { Icon } from 'fundamental-react';

import { Tooltip } from 'react-shared';

import { InfoButtonWrapper } from './styled';

const InfoButton = ({ content }) => {
  return (
    <InfoButtonWrapper>
      <Tooltip title={content}>
        <Icon glyph="sys-help" />
      </Tooltip>
    </InfoButtonWrapper>
  );
};

export default InfoButton;

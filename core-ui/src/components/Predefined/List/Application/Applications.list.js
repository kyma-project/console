import React from 'react';
import CreateApplicationModal from './CreateApplicationModal';

export const ApplicationsList = DefaultRenderer => ({ ...otherParams }) => {
  return (
    <DefaultRenderer
      customHeaderActions={<CreateApplicationModal />}
      {...otherParams}
    />
  );
};

import React from 'react';
import CreateNewRepository from './CreateNewRepository';

export const GitRepositoriesList = DefaultRenderer => ({ ...otherParams }) => {
  const listActions = (
    <CreateNewRepository namespaceName={otherParams.resourceName} />
  );

  return <DefaultRenderer listHeaderActions={listActions} {...otherParams} />;
};

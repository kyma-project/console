import React from 'react';
import CreateNewRepository from './CreateNewRepository';
import { Button } from 'fundamental-react';

export const GitRepositoriesList = DefaultRenderer => ({ ...otherParams }) => {
  const listActions = (
    <CreateNewRepository namespaceName={otherParams.resourceName} />
  );

  return <DefaultRenderer listHeaderActions={listActions} {...otherParams} />;
};

import React from 'react';
import { NamespaceCreateForm } from '../Create';

export const NamespacesList = DefaultRenderer => ({ ...otherParams }) => {
  return (
    <DefaultRenderer
      createResourceForm={NamespaceCreateForm}
      {...otherParams}
    />
  );
};

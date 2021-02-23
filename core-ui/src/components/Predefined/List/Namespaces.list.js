import React from 'react';
import { NamespaceCreateModal, NamespaceCreateForm } from '../Create';

export const NamespacesList = DefaultRenderer => ({ ...otherParams }) => {
  const extraHeaderContent = (
    <NamespaceCreateModal
      ResourcesCreateForm={NamespaceCreateForm}
      {...otherParams}
    />
  );

  return (
    <DefaultRenderer extraHeaderContent={extraHeaderContent} {...otherParams} />
  );
};

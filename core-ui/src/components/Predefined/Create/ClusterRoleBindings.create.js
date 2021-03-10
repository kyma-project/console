import React from 'react';
import { RoleBindings } from './RoleBindings/RoleBindings.js';

export const ClusterRoleBindingsCreate = ({
  formElementRef,
  onChange,
  resourceType,
  resourceUrl,
  namespace,
  refetchList,
}) => (
  <RoleBindings
    formElementRef={formElementRef}
    onChange={onChange}
    resourceType={resourceType}
    resourceUrl={resourceUrl}
    namespace={namespace}
    refetchList={refetchList}
  />
);

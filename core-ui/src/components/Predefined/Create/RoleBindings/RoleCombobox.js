import React, { useState } from 'react';

import { Menu, Token, ComboboxInput } from 'fundamental-react';
import { useGetList } from 'react-shared';
import './RoleCombobox.scss';

export const RoleCombobox = ({ setRole, setRoleKind, namespace }) => {
  const [searchPhrase, setSearchPhrase] = useState('');
  const chooseRole = (roleName, roleKind) => {
    setSearchPhrase(roleName);
    setRole(roleName);
    setRoleKind(roleKind);
  };

  const clusterRolesUrl = '/apis/rbac.authorization.k8s.io/v1/clusterroles';
  const {
    data: clusterRoles,
    loading: clusterRolesLoading = true,
    error: clusterRolesError,
  } = useGetList()(clusterRolesUrl, { pollingInterval: 3000 });

  if (clusterRolesLoading) return 'Loading...';
  if (clusterRolesError) return clusterRolesError.message;

  const search = name => name.toLowerCase().includes(searchPhrase);
  const clusterRoleNames = (clusterRoles || [])
    .map(role => role.metadata.name)
    .filter(search);

  console.log(clusterRoles);

  const allRoles = clusterRoleNames.map(name => (
    <Menu.Item
      key={`R_${name}`}
      onClick={() => chooseRole(name, 'ClusterRole')}
    >
      <Token>CR</Token> {name}
    </Menu.Item>
  ));

  return (
    <ComboboxInput
      inputProps={{
        onChange: s => setSearchPhrase(s.target.value.toLowerCase()),
        value: searchPhrase,
      }}
      placeholder="Choose role..."
      className="role-combobox"
      buttonProps={{ typeAttr: 'button' }}
      menu={
        <Menu.List className="role-combobox__list no-dismiss-tokens">
          {allRoles.length ? allRoles : <Menu.Item>No roles found</Menu.Item>}
        </Menu.List>
      }
    />
  );
};

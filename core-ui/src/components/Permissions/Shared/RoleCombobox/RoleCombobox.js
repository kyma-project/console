import React from 'react';

import { Menu, Token, ComboboxInput } from 'fundamental-react';
import './RoleCombobox.scss';

import { GET_CLUSTER_ROLES, GET_ROLES } from 'gql/queries';
import { useQuery } from '@apollo/react-hooks';

export default function RoleCombobox({ setRole, namespaceId }) {
  const [searchPhrase, setSearchPhrase] = React.useState('');
  const chooseRole = (roleName, roleKind) => {
    setSearchPhrase(roleName);
    setRole(roleName, roleKind);
  };

  const clusterRolesQuery = useQuery(GET_CLUSTER_ROLES);
  const rolesQuery = useQuery(GET_ROLES, {
    variables: { namespace: namespaceId },
    skip: !namespaceId,
  });

  const search = name => name.toLowerCase().includes(searchPhrase);
  const roleNames = (rolesQuery.data?.roles || [])
    .map(({ name }) => name)
    .filter(search);
  const clusterRoleNames = (clusterRolesQuery.data?.clusterRoles || [])
    .map(({ name }) => name)
    .filter(search);

  const roles = roleNames
    .map(name => (
      <Menu.Item key={`R_${name}`} onClick={() => chooseRole(name, 'Role')}>
        <Token>R</Token> {name}
      </Menu.Item>
    ))
    .concat(
      clusterRoleNames.map(name => (
        <Menu.Item
          key={`R_${name}`}
          onClick={() => chooseRole(name, 'ClusterRole')}
        >
          <Token>CR</Token> {name}
        </Menu.Item>
      )),
    );

  return (
    <ComboboxInput
      inputProps={{
        onChange: s => setSearchPhrase(s.target.value.toLowerCase()),
        value: searchPhrase,
      }}
      placeholder="Choose role..."
      className="role-combobox"
      menu={
        <Menu.List className="role-combobox__list no-dismiss-tokens">
          {roles.length ? roles : <Menu.Item>No roles found</Menu.Item>}
        </Menu.List>
      }
    />
  );
}

import React from 'react';
import PropTypes from 'prop-types';

import {
  useNotification,
  Modal,
  K8sNameInput,
  isK8SNameValid,
} from 'react-shared';

import {
  Button,
  FormRadioGroup,
  FormRadioItem,
  FormItem,
  FormLabel,
  FormInput,
} from 'fundamental-react';

import { CREATE_ROLE_BINDING } from 'gql/mutations';
import { GET_ROLE_BINDINGS } from 'gql/queries';
import { useMutation } from 'react-apollo';
import RoleCombobox from '../Shared/RoleCombobox/RoleCombobox';
import InvalidGroupMessage from '../Shared/InvalidGroupMessage';

CreateRoleBindingModal.propTypes = { namespaceId: PropTypes.string.isRequired };

export default function CreateRoleBindingModal({ namespaceId }) {
  const notification = useNotification();

  const [subject, setSubject] = React.useState('');
  const [isGroup, setGroup] = React.useState(false);
  const [role, setRole] = React.useState('');
  const [roleKind, setRoleKind] = React.useState('');

  const [createRoleBinding] = useMutation(CREATE_ROLE_BINDING, {
    refetchQueries: () => [
      { query: GET_ROLE_BINDINGS, variables: { namespace: namespaceId } },
    ],
  });

  const groupValid = !isGroup || isK8SNameValid(subject);
  const canSubmit = !!role && !!subject && groupValid;

  const create = async () => {
    const name = `${subject}-${role}`;
    const params = {
      roleName: role,
      roleKind: roleKind,
      subjects: [{ name: subject, kind: isGroup ? 'Group' : 'User' }],
    };
    try {
      await createRoleBinding({
        variables: { name, namespace: namespaceId, params },
      });
      notification.notifySuccess({
        content: 'Role Binding created',
      });
    } catch (e) {
      console.warn(e);
      notification.notifyError({
        content: `Could not create Role Binding: ${e.message}`,
      });
    }
  };

  return (
    <Modal
      title="Create Binding"
      modalOpeningComponent={
        <Button glyph="add" option="light">
          Create Binding
        </Button>
      }
      confirmText="Save"
      cancelText="Cancel"
      disabledConfirm={!canSubmit}
      onConfirm={create}
    >
      <FormRadioGroup
        inline
        onChange={e => setGroup(e.target.value !== 'user')}
      >
        <FormRadioItem value="user" inputProps={{ defaultChecked: true }}>
          User
        </FormRadioItem>
        <FormRadioItem value="user-group">User Group</FormRadioItem>
      </FormRadioGroup>
      <FormItem style={{ clear: 'both' }}>
        {isGroup ? (
          <K8sNameInput
            kind="User Group"
            onChange={e => setSubject(e.target.value)}
          />
        ) : (
          <>
            <FormLabel required>User</FormLabel>
            <FormInput
              type="text"
              value={subject}
              placeholder="User name"
              onChange={e => setSubject(e.target.value)}
              required
            />
          </>
        )}
      </FormItem>
      {subject && !groupValid && <InvalidGroupMessage />}
      <FormItem>
        <FormLabel required>Role</FormLabel>
        <RoleCombobox
          namespaceId={namespaceId}
          setRole={(roleName, roleKind) => {
            setRole(roleName);
            setRoleKind(roleKind);
          }}
        />
      </FormItem>
    </Modal>
  );
}

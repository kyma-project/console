import React from 'react';
import PropTypes from 'prop-types';
import { useCreateBinding, formatRoleBinding } from '../helpers';
import { useNotification, Modal } from 'react-shared';

import {
  Button,
  FormRadioGroup,
  FormRadioItem,
  FormItem,
  FormLabel,
  FormInput,
} from 'fundamental-react';

import RoleCombobox from '../Shared/RoleCombobox/RoleCombobox';

CreateRoleBindingModal.propTypes = {
  namespaceId: PropTypes.string.isRequired,
  refetchRoleBindingsFn: PropTypes.func.isRequired,
};

export default function CreateRoleBindingModal({
  namespaceId,
  refetchRoleBindingsFn,
}) {
  const notification = useNotification();
  const createBinding = useCreateBinding(
    `namespaces/${namespaceId}/rolebindings`,
  );

  const [subject, setSubject] = React.useState('');
  const [isGroup, setGroup] = React.useState(false);
  const [role, setRole] = React.useState('');
  const [roleKind, setRoleKind] = React.useState('');

  const canSubmit = !!role && !!subject;

  const create = async () => {
    const params = {
      name: `${subject}-${role}`,
      namespace: namespaceId,
      kind: 'RoleBinding',
      roleName: role,
      roleKind: roleKind,
      subjectName: subject,
      subjectKind: isGroup ? 'Group' : 'User',
    };
    try {
      await createBinding(formatRoleBinding(params));

      await refetchRoleBindingsFn();
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
        <FormLabel required>{isGroup ? 'User group' : 'User name'}</FormLabel>
        <FormInput
          type="text"
          value={subject}
          placeholder={`User ${isGroup ? 'group' : 'name'}`}
          onChange={e => setSubject(e.target.value)}
          required
        />
      </FormItem>
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

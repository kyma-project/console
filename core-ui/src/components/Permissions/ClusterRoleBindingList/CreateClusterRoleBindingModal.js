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
import InvalidGroupMessage from '../Shared/InvalidGroupMessage';

CreateClusterRoleBindingModal.propTypes = {
  refetchClusterRoleBindingsFn: PropTypes.func.isRequired,
};

const isGroupNameValid = name => {
  const kebabCase = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
  const camelCase = /^[a-z][A-Za-z0-9]*[A-Za-z0-9]*$/;
  return kebabCase.test(name) || camelCase.test(name);
};

export default function CreateClusterRoleBindingModal({
  refetchClusterRoleBindingsFn,
}) {
  const notification = useNotification();
  const createClusterBinding = useCreateBinding(`clusterrolebindings`);

  const [subject, setSubject] = React.useState('');
  const [isGroup, setGroup] = React.useState(false);
  const [role, setRole] = React.useState('');

  const groupValid = !isGroup || isGroupNameValid(subject);
  const canSubmit = !!role && !!subject && groupValid;

  const create = async () => {
    try {
      const params = {
        name: `${subject}-${role}`,
        kind: 'ClusterRoleBinding',
        roleName: role,
        roleKind: 'ClusterRole',
        subjectName: subject,
        subjectKind: isGroup ? 'Group' : 'User',
      };

      await createClusterBinding(formatRoleBinding(params));
      await refetchClusterRoleBindingsFn();
      notification.notifySuccess({
        content: 'Cluster Role Binding created',
      });
    } catch (e) {
      console.warn(e);
      notification.notifyError({
        content: `Could not create Cluster Role Binding: ${e.message}`,
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
      {subject && !groupValid && <InvalidGroupMessage />}
      <FormItem>
        <FormLabel required>Role</FormLabel>
        <RoleCombobox setRole={(roleName, _) => setRole(roleName)} />
      </FormItem>
    </Modal>
  );
}

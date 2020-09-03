import React from 'react';

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

import { GET_CLUSTER_ROLE_BINDINGS } from 'gql/queries';
import { CREATE_CLUSTER_ROLE_BINDING } from 'gql/mutations';
import { useMutation } from 'react-apollo';
import RoleCombobox from '../Shared/RoleCombobox/RoleCombobox';
import InvalidGroupMessage from '../Shared/InvalidGroupMessage';

export default function CreateClusterRoleBindingModal() {
  const notification = useNotification();
  const [subject, setSubject] = React.useState('');
  const [isGroup, setGroup] = React.useState(false);
  const [role, setRole] = React.useState('');

  const [createClusterRoleBinding] = useMutation(CREATE_CLUSTER_ROLE_BINDING, {
    refetchQueries: () => [{ query: GET_CLUSTER_ROLE_BINDINGS }],
  });

  const groupValid = !isGroup || isK8SNameValid(subject);
  const canSubmit = !!role && !!subject && groupValid;

  const create = async () => {
    try {
      const name = `${subject}-${role}`;
      const params = {
        roleName: role,
        subjects: [{ name: subject, kind: isGroup ? 'Group' : 'User' }],
      };
      await createClusterRoleBinding({ variables: { name, params } });
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
        <RoleCombobox setRole={(roleName, _) => setRole(roleName)} />
      </FormItem>
    </Modal>
  );
}

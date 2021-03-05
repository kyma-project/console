import React, { useState } from 'react';

import { usePost, useNotification } from 'react-shared';
import {
  FormRadioGroup,
  FormRadioItem,
  FormItem,
  FormLabel,
  FormInput,
} from 'fundamental-react';

import { RoleCombobox } from './RoleCombobox.js';

export const RoleBindings = ({
  formElementRef,
  onChange,
  namespace,
  resourceUrl,
  refetchList,
}) => {
  const [subject, setSubject] = useState('');
  const [isGroup, setGroup] = useState(false);
  const [role, setRole] = useState('');
  const [roleKind, setRoleKind] = useState('');

  const request = usePost();
  const notification = useNotification();

  const handleFormSubmit = async e => {
    e.preventDefault();
    try {
      const params = {
        kind: `${roleKind}Binding`,
        metadata: {
          name: `${subject}-${role}`,
        },
        roleRef: {
          kind: roleKind,
          name: role,
        },
        subjects: [
          {
            kind: isGroup ? 'Group' : 'User',
            name: subject,
          },
        ],
      };

      await request(resourceUrl, params);
      notification.notifySuccess({ title: 'Succesfully created Resource' });
      refetchList();
    } catch (err) {
      console.warn(err);
      notification.notifyError({
        content: `Could not create the Role Binding: ${err.message}`,
      });
    }
  };

  return (
    // although HTML spec assigns the role by default to a <form> element, @testing-library ignores it
    // eslint-disable-next-line jsx-a11y/no-redundant-roles
    <form
      role="form"
      onChange={onChange}
      ref={formElementRef}
      onSubmit={handleFormSubmit}
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
          setRole={setRole}
          setRoleKind={setRoleKind}
          namespace={namespace}
        />
      </FormItem>
    </form>
  );
};

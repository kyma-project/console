import React from 'react';

import {
  FormItem,
  FormLabel,
  FormMessage,
  InlineHelp,
} from 'fundamental-react';
import { K8sNameInput } from 'react-shared';

import { FORMS } from '../../constants';

import './ResourceNameInput.scss';

export function ResourceNameInput({ nameStatus, kind, ...otherProps }) {
  const validationMessage = nameStatus ? (
    <FormMessage type="error">{nameStatus}</FormMessage>
  ) : null;

  return (
    <div className="resource-name-input">
      <FormItem>
        <FormLabel className="resource-name-input__label" required={true}>
          {FORMS.RESOURCE_NAME.LABEL}
          <InlineHelp
            placement="bottom-right"
            text={FORMS.RESOURCE_NAME.INLINE_HELP}
          />
        </FormLabel>
        <K8sNameInput {...otherProps} kind={kind} />
        {validationMessage}
      </FormItem>
    </div>
  );
}

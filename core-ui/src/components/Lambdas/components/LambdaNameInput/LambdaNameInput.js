import React from 'react';

import {
  FormItem,
  FormLabel,
  FormMessage,
  InlineHelp,
} from 'fundamental-react';
import { K8sNameInput } from 'react-shared';

import { LAMBDAS_LIST } from 'components/Lambdas/constants';

import './LambdaNameInput.scss';

export function LambdaNameInput({
  functionNames = [],
  nameStatus,
  ...otherProps
}) {
  const validationMessage = nameStatus ? (
    <FormMessage type="error">{nameStatus}</FormMessage>
  ) : null;

  return (
    <div className="lambda-name-input">
      <FormItem>
        <FormLabel className="lambda-name-input__label">
          {LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.LABEL}
          <InlineHelp
            placement="bottom-right"
            text={LAMBDAS_LIST.CREATE_MODAL.INPUTS.NAME.INLINE_HELP}
          />
        </FormLabel>
        <K8sNameInput {...otherProps} kind="Function" />
        {validationMessage}
      </FormItem>
    </div>
  );
}

import React from 'react';

import { FormLabel, InlineHelp } from 'fundamental-react';
import LabelSelectorInput from 'components/LabelSelectorInput/LabelSelectorInput';

import { LAMBDAS_LIST } from 'components/Lambdas/constants';

import './LabelsInput.scss';

export function LabelsInput({ ...otherProps }) {
  return (
    <div className="lambda-labels-input">
      <FormLabel className="lambda-labels-input__label">
        {LAMBDAS_LIST.CREATE_MODAL.INPUTS.LABEL.LABEL}
        <InlineHelp
          placement="bottom-right"
          text={LAMBDAS_LIST.CREATE_MODAL.INPUTS.LABEL.INLINE_HELP}
        />
      </FormLabel>
      <LabelSelectorInput {...otherProps} />
    </div>
  );
}

import React from 'react';

import { FormLabel, InlineHelp } from 'fundamental-react';
import { LabelSelectorInput } from 'react-shared';

import { FORMS } from 'components/Lambdas/constants';

import './LabelsInput.scss';

export function LabelsInput({ ...otherProps }) {
  return (
    <div className="resource-labels-input">
      <FormLabel className="resource-labels-input__label">
        {FORMS.LABELS.LABEL}
        <InlineHelp placement="bottom-right" text={FORMS.LABELS.INLINE_HELP} />
      </FormLabel>
      <LabelSelectorInput {...otherProps} />
    </div>
  );
}

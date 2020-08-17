import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';
import { functionAvailableLanguages } from 'components/Lambdas/helpers/misc';
import { FormItem, FormLabel, FormSelect } from 'fundamental-react';
import { LAMBDAS_LIST } from '../constants';

import { getKeyByValue } from './helpers';

export const RuntimesDropdown = ({
  _ref,
  defaultRuntime = functionAvailableLanguages.nodejs12,
}) => {
  return (
    <FormItem>
      <FormLabel htmlFor="runtime-dropdon">
        {LAMBDAS_LIST.CREATE_MODAL.INPUTS.RUNTIME.NAME}
      </FormLabel>
      <FormSelect
        ref={_ref}
        id="runtime-dropdon"
        role="select"
        defaultValue={defaultRuntime}
      >
        {Object.values(functionAvailableLanguages).map(lang => (
          <option
            aria-label="option"
            key={lang}
            value={getKeyByValue(functionAvailableLanguages, lang)}
          >
            {lang}
          </option>
        ))}
      </FormSelect>
    </FormItem>
  );
};

RuntimesDropdown.propTypes = {
  _ref: CustomPropTypes.ref,
  defaultRuntime: PropTypes.string,
};

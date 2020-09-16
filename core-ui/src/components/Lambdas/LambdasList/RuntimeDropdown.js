import React from 'react';
import PropTypes from 'prop-types';
import { CustomPropTypes } from 'react-shared';
import { functionAvailableLanguages } from 'components/Lambdas/helpers/runtime';
import { FormItem, FormLabel, FormSelect } from 'fundamental-react';
import { LAMBDAS_LIST } from '../constants';

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
        {Object.entries(functionAvailableLanguages).map(([runtime, lang]) => (
          <option aria-label="option" key={lang} value={runtime}>
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

import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from '../typechecking/CustomPropTypes';
import { InlineHelp, FormLabel } from 'fundamental-react';

// TODO move to some shared place

export const K8sNameField = ({ _ref, id, kind, onKeyDown }) => (
  <>
    <FormLabel htmlFor={id}>
      Name*
      <InlineHelp
        placement="bottom-right"
        text="
              The name must consist of lower case alphanumeric characters or dashes, 
              and must start and end with an alphanumeric character (e.g. 'my-name1').
              "
      />
    </FormLabel>
    <input
      className="fd-form__control"
      ref={_ref}
      type="text"
      id={id}
      placeholder={kind + ' name'}
      aria-required="true"
      required
      pattern="^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$"
      onKeyDown={onKeyDown}
    />
  </>
);

K8sNameField.propTypes = {
  _ref: CustomPropTypes.ref,
  id: PropTypes.string,
  kind: PropTypes.string,
  onKeyDown: PropTypes.func,
};

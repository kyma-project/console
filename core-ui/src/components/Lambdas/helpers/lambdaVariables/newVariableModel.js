import shortid from 'shortid';
import { VARIABLE_TYPE, VARIABLE_VALIDATION } from './constants';

export function newVariableModel({
  type = VARIABLE_TYPE.CUSTOM,
  variable = {},
  validation = VARIABLE_VALIDATION.NONE,
  additionalProps = {},
}) {
  return {
    id: shortid.generate(),
    type,
    name: variable.name || '',
    value: variable.value || '',
    validation: validation,
    ...additionalProps,
  };
}

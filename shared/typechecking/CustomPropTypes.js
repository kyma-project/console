import PropTypes from 'prop-types';

export const ref = PropTypes.shape({ current: PropTypes.any });

export const button = function(props, propName, componentName) {
  if (!props[propName]) return false;

  const buttonProps = new Map([
    ['compact', 'boolean'],
    ['disabled', 'boolean'],
    ['glyph', 'string'],
    ['label', 'string'],
    ['text', 'string'],
  ]);
  function hasTextOrLabel() {
    return (
      !props[propName].hasOwnProperty('text') &&
      !props[propName].hasOwnProperty('label') &&
      new Error(`Either "text" or "label" is required`)
    );
  }

  function checkTypes() {
    for (const [key, type] of buttonProps.entries()) {
      if (
        props[propName].hasOwnProperty(key) &&
        typeof props[propName][key] !== type
      ) {
        return new Error(
          `Invalid prop ${propName} supplied to ${componentName}. Expected ${key} to be ${type}.`,
        );
      }
    }
  }

  const hasRequiredProps = hasTextOrLabel();
  if (hasRequiredProps) return hasRequiredProps || null;

  const hasPropsOfValidTypes = checkTypes();
  if (hasPropsOfValidTypes) return hasPropsOfValidTypes || null;

  return null;
};

export const listActions = PropTypes.arrayOf(function(
  props,
  index,
  componentName,
) {
  const element = props[index];
  if (!element.name) {
    return new Error(`name is a required prop in '${componentName}'!`);
  }
  if (!element.handler && !element.component) {
    return new Error(
      `One of props 'handler' or 'component' was not specified in '${componentName}'.`,
    );
  }
});

export default {
  button,
  ref,
  listActions,
};

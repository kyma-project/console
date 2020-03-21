import { TRIGGER_SCHEMA } from '../../constants';

export const bemClasses = {
  element(element) {
    return element ? `${TRIGGER_SCHEMA.CSS_PREFIX}__${element}` : '';
  },
  modifier(modifier, element) {
    return modifier
      ? `${TRIGGER_SCHEMA.CSS_PREFIX}${
          element ? `__${element}` : ''
        }--${modifier}`
      : '';
  },
  concatenate(classes) {
    return classes.filter(Boolean).join(' ');
  },
};

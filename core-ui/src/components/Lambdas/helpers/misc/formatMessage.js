import { isPrimitive } from './isPrimitive';

export function formatMessage(message = '', variables = {}) {
  const serializedVariables = {};
  for (let [key, value] of Object.entries(variables)) {
    if (!key.startsWith('{')) {
      key = `{${key}`;
    }
    if (!key.endsWith('}')) {
      key = `${key}}`;
    }

    if (value && isPrimitive(value)) {
      value = value.toString();
    } else {
      value = JSON.stringify(value || '');
    }

    serializedVariables[key] = value;
  }

  for (const variable in serializedVariables) {
    message = message.replace(variable, serializedVariables[variable]);
  }

  return message;
}

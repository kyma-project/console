import { CONFIG } from 'components/Lambdas/config';
import { formatMessage } from 'components/Lambdas/helpers/misc';

import {
  PRETTY_RUNTIME_NODEJS10_NAME,
  PRETTY_RUNTIME_NODEJS12_NAME,
  PRETTY_RUNTIME_PYTHON37_NAME,
} from '../../constants';

export const nodejs12 = 'nodejs12';
export const nodejs10 = 'nodejs10';
export const python37 = 'python37';

export const functionAvailableLanguages = {
  // order of those keys is the same as order of available runtimes shown in Create Lambda Modal
  [nodejs12]: PRETTY_RUNTIME_NODEJS12_NAME,
  [nodejs10]: PRETTY_RUNTIME_NODEJS10_NAME,
  [python37]: PRETTY_RUNTIME_PYTHON37_NAME,
};

export const prettyRuntime = runtime =>
  functionAvailableLanguages[runtime] || `Unknown: ${runtime}`;

export const runtimeToMonacoEditorLang = runtime => {
  switch (runtime) {
    case python37:
      return {
        language: 'python',
        dependencies: 'plaintext',
      };
    case nodejs12:
    case nodejs10:
      return {
        language: 'javascript',
        dependencies: 'json',
      };
    default:
      return {
        language: 'plaintext',
        dependencies: 'plaintext',
      };
  }
};

export const getDefaultDependencies = (name, runtime) => {
  switch (runtime) {
    case python37:
      return CONFIG.defaultLambdaCodeAndDeps.python37.deps;
    case nodejs12:
    case nodejs10:
      return !name
        ? ''
        : formatMessage(CONFIG.defaultLambdaCodeAndDeps.nodejs12.deps, {
            lambdaName: name,
          });
    default:
      return '';
  }
};

export const checkDepsValidity = (runtime, deps) => {
  switch (runtime) {
    case nodejs10:
    case nodejs12:
      if (!isJson(deps)) {
        return false;
      }
      break;
    default:
      return true;
  }
};

export const isJson = item => {
  if (typeof item !== 'string') {
    return false;
  }

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  if (typeof item === 'object' && item !== null) {
    return true;
  }

  return false;
};

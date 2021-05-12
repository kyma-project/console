import { CONFIG } from 'components/Lambdas/config';
import { formatMessage } from 'components/Lambdas/helpers/misc';

import {
  PRETTY_RUNTIME_NODEJS12_NAME,
  PRETTY_RUNTIME_NODEJS14_NAME,
  PRETTY_RUNTIME_PYTHON38_NAME,
} from '../../constants';

export const nodejs12 = 'nodejs12';
export const nodejs14 = 'nodejs14';
export const nodejs10 = 'nodejs10';
export const python38 = 'python38';

export const functionAvailableLanguages = {
  // order of those keys is the same as order of available runtimes shown in Create Lambda Modal
  [nodejs14]: PRETTY_RUNTIME_NODEJS14_NAME,
  [nodejs12]: PRETTY_RUNTIME_NODEJS12_NAME,
  [python38]: PRETTY_RUNTIME_PYTHON38_NAME,
};

export const prettyRuntime = runtime => {
  if (runtime === 'nodejs10') {
    return 'Node.js 10 (Unsupported)';
  } else {
    return functionAvailableLanguages[runtime] || `Unknown: ${runtime}`;
  }
};

export const runtimeToMonacoEditorLang = runtime => {
  switch (runtime) {
    case python38:
      return {
        language: 'python',
        dependencies: 'plaintext',
      };
    case nodejs14:
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
    case python38:
      return CONFIG.defaultLambdaCodeAndDeps.python38.deps;
    case nodejs14:
    case nodejs12:
    case nodejs10:
      return !name
        ? ''
        : formatMessage(CONFIG.defaultLambdaCodeAndDeps.nodejs14.deps, {
            lambdaName: name,
          });
    default:
      return '';
  }
};

export const checkDepsValidity = (runtime, deps) => {
  switch (runtime) {
    case nodejs10:
    case nodejs14:
    case nodejs12:
      return isJson(deps);
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

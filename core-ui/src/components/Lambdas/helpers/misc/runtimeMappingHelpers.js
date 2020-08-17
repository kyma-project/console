import { CONFIG } from 'components/Lambdas/config';
import { formatMessage } from 'components/Lambdas/helpers/misc';

export const nodejs12 = 'nodejs12';
export const nodejs10 = 'nodejs10';
export const python37 = 'python37';

export const functionAvailableLanguages = {
  // order of those keys is the same as order of available runtimes shown in Create Lambda Modal
  [nodejs12]: 'Node.js 12',
  [nodejs10]: 'Node.js 10',
  [python37]: 'Python 3.7',
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

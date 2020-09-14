import { randomNamesGenerator } from '@kyma-project/common';

export function randomNameGenerator(functionNames = []) {
  let name = '';
  do {
    name = randomNamesGenerator();
  } while (functionNames.includes(name));
  return name;
}

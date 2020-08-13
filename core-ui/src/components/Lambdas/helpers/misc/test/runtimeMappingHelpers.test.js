import {
  prettyRuntime,
  runtimeToMonacoEditorLang,
  getDefaultDependencies,
} from '../runtimeMappingHelpers';

describe('prettyRuntime', () => {
  test.each([
    ['python37', 'Python 3.7'],
    ['nodejs10', 'Node.js 10'],
    ['nodejs12', 'Node.js 12'],
    [undefined, 'Unknown: undefined'],
    [null, 'Unknown: null'],
    ['custom-one', 'Unknown: custom-one'],
  ])('.prettyRuntime(%s, %s)', (runtime, expected) => {
    const result = prettyRuntime(runtime);
    expect(result).toBe(expected);
  });
});

describe('runtimeToMonacoEditorLang', () => {
  test.each([
    ['python37', { language: 'python', dependencies: 'plaintext' }],
    ['nodejs10', { language: 'javascript', dependencies: 'json' }],
    ['nodejs12', { language: 'javascript', dependencies: 'json' }],
    ['', { language: 'plaintext', dependencies: 'plaintext' }],
    [undefined, { language: 'plaintext', dependencies: 'plaintext' }],
    [null, { language: 'plaintext', dependencies: 'plaintext' }],
  ])('.runtimeToMonacoEditorLang(%s, %p)', (runtime, expected) => {
    const result = runtimeToMonacoEditorLang(runtime);
    expect(result).toEqual(expected);
  });
});

describe('getDefaultDependencies', () => {
  test.each([
    ['test-name', 'python37', ''],
    [
      'test-name',
      'nodejs10',
      `{ 
  "name": "test-name",
  "version": "1.0.0",
  "dependencies": {}
}`,
    ],
    [
      'other-test-name',
      'nodejs12',
      `{ 
  "name": "other-test-name",
  "version": "1.0.0",
  "dependencies": {}
}`,
    ],
    [null, 'python37', ''],
    [undefined, 'nodejs10', ''],
    [undefined, 'nodejs12', ''],
    ['', 'nodejs12', ``],
  ])('.getDefaultDependencies(%s, %s)', (name, runtime, expected) => {
    const result = getDefaultDependencies(name, runtime);
    expect(result).toEqual(expected);
  });
});

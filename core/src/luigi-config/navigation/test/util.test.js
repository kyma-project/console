import { extractKymaVersion } from './../util';

describe('extractKymaVersion', () => {
    const testCases = [
        ['test-repo/test-image', 'test-repo/test-image'],
        ['eu.gcr.io/test/1.2.3', '1.2.3'],
        ['eu.gcr.io/test/PR-1234', 'pull request PR-1234'],
        ['eu.gcr.io/test/master-12345678', 'master-12345678'],
        ['eu.gcr.io/kyma-project/kyma-installer:1.17.1', '1.17.1'],
    ];

    test.each(testCases)(
        "%p -> %p",
        (image, expectedVersion) => {
            const deployment = deploymentWithImage(image);
            const version = extractKymaVersion(deployment);
            expect(version).toEqual(expectedVersion);
        }
      );

    const deploymentWithImage = image => ({
        spec: {template: {spec: {containers: [{image}]}}}
    });
});

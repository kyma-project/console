import React from 'react';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';

import { componentUpdate } from '../../../../testing';

import { lambda, lambdaNoContent, mocks } from './gqlMocks';
import LambdaDetails from '../LambdaDetails';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    getEventData: () => ({ environmentId: 'testnamespace' }),
    getNodeParams: () => ({ selectedTab: 'Code' }),
    uxManager: () => ({
      addBackdrop: () => {},
      removeBackdrop: () => {},
    }),
    linkManager: () => ({
      withParams: () => ({
        pathExists: () => Promise.resolve(true),
        openAsSplitView: () => ({
          collapse: () => {},
          expand: () => {},
        }),
      }),
    }),
  };
});

describe('LambdaDetails', () => {
  it('Displays lambda, its size, runtime and content', async () => {
    const component = mount(
      <MockedProvider mocks={mocks}>
        <LambdaDetails lambda={lambda} refetchLambda={() => {}} />
      </MockedProvider>,
    );

    await componentUpdate(component);

    const lambdaSizeInput = component.find('#lambdaSize');
    expect(lambdaSizeInput.exists()).toEqual(true);
    expect(lambdaSizeInput.props().defaultValue).toEqual(lambda.size);

    const lambdaRuntimeInput = component.find('#lambdaRuntime');
    expect(lambdaRuntimeInput.exists()).toEqual(true);
    expect(lambdaRuntimeInput.props().defaultValue).toEqual(lambda.runtime);

    const lambdaContentInput = component.find('#lambdaContent').first();
    expect(lambdaContentInput.exists()).toEqual(true);
    expect(lambdaContentInput.props().value).toEqual(lambda.content);
  });

  it('Displays lambda, its size, runtime and default content', async () => {
    const component = mount(
      <MockedProvider mocks={mocks}>
        <LambdaDetails lambda={lambdaNoContent} refetchLambda={() => {}} />
      </MockedProvider>,
    );

    await componentUpdate(component);

    const lambdaSizeInput = component.find('#lambdaSize');
    expect(lambdaSizeInput.exists()).toEqual(true);
    expect(lambdaSizeInput.props().defaultValue).toEqual(lambda.size);

    const lambdaRuntimeInput = component.find('#lambdaRuntime');
    expect(lambdaRuntimeInput.exists()).toEqual(true);
    expect(lambdaRuntimeInput.props().defaultValue).toEqual(lambda.runtime);

    const lambdaContentInput = component.find('#lambdaContent').first();
    expect(lambdaContentInput.exists()).toEqual(true);
    expect(lambdaContentInput.props().value).toEqual(
      `module.exports = { 
  main: function (event, context) {

  }
}`,
    );
  });
});

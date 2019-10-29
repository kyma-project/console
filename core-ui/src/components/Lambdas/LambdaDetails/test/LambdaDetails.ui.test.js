import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { MockedProvider } from '@apollo/react-testing';

import {
  getLambdaSuccessMock,
  getLambdaNoContentSuccessMock,
  lambda,
} from './gqlMocks';
import { componentUpdate } from '../../../../testing';
import LambdaDetails from '../LambdaDetails';
import Spinner from '../../../../shared/components/Spinner/Spinner';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    getEventData: () => ({ environmentId: 'testnamespace' }),
    getNodeParams: () => ({ selectedTab: 'Code' }),
  };
});

describe('LambdaDetails', () => {
  it('Renders with an error in no lambdaId is provided', async () => {
    console.error = jest.fn();
    let component;
    await renderer.act(async () => {
      component = renderer.create(
        <MockedProvider>
          <LambdaDetails />
        </MockedProvider>,
      );
    });
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    expect(console.error.mock.calls.length).toBe(1);
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
  });

  it('Shows loading indicator only when data is not yet loaded', async () => {
    const component = mount(
      <MockedProvider>
        <LambdaDetails lambdaId={lambda.name} />
      </MockedProvider>,
    );
    expect(component.find(Spinner)).toHaveLength(1);

    await componentUpdate(component);

    expect(component.find(Spinner)).toHaveLength(0);
  });

  it('Displays lambda, its size, runtime and content', async () => {
    const gqlMock = [getLambdaSuccessMock()];

    const component = mount(
      <MockedProvider mocks={gqlMock}>
        <LambdaDetails lambdaId={lambda.name} />
      </MockedProvider>,
    );

    await componentUpdate(component);

    const lambdaSizeInput = component.find('#lambdaSize');
    expect(lambdaSizeInput.exists()).toEqual(true);
    expect(lambdaSizeInput.props().defaultValue).toEqual(lambda.size);

    const lambdaRuntimeInput = component.find('#lambdaRuntime');
    expect(lambdaRuntimeInput.exists()).toEqual(true);
    expect(lambdaRuntimeInput.props().defaultValue).toEqual(lambda.runtime);

    const lambdaContentInput = component.find('#lambdaContent');
    expect(lambdaContentInput.exists()).toEqual(true);
    expect(lambdaContentInput.props().value).toEqual(lambda.content);
  });

  it('Displays lambda, its size, runtime and default content', async () => {
    const gqlMock = [getLambdaNoContentSuccessMock()];

    const component = mount(
      <MockedProvider mocks={gqlMock}>
        <LambdaDetails lambdaId={lambda.name} />
      </MockedProvider>,
    );

    await componentUpdate(component);

    const lambdaSizeInput = component.find('#lambdaSize');
    expect(lambdaSizeInput.exists()).toEqual(true);
    expect(lambdaSizeInput.props().defaultValue).toEqual(lambda.size);

    const lambdaRuntimeInput = component.find('#lambdaRuntime');
    expect(lambdaRuntimeInput.exists()).toEqual(true);
    expect(lambdaRuntimeInput.props().defaultValue).toEqual(lambda.runtime);

    const lambdaContentInput = component.find('#lambdaContent');
    expect(lambdaContentInput.exists()).toEqual(true);
    expect(lambdaContentInput.props().value).toEqual(
      "console.log('Hello World!');",
    );
  });
});

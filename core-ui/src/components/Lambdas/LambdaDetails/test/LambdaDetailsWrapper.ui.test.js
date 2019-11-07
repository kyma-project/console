import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MockedProvider } from '@apollo/react-testing';

import { lambda } from './gqlMocks';
import { componentUpdate } from '../../../../testing';
import LambdaDetailsWrapper from '../LambdaDetailsWrapper';
import Spinner from '../../../../shared/components/Spinner/Spinner';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    getEventData: () => ({ environmentId: 'testnamespace' }),
    getNodeParams: () => ({ selectedTab: 'Code' }),
  };
});

describe('LambdaDetailsWrapper', () => {
  it('Renders with an error in no lambdaName is provided', async () => {
    console.error = jest.fn();
    let component;
    await renderer.act(async () => {
      component = renderer.create(
        <MockedProvider>
          <LambdaDetailsWrapper />
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
        <LambdaDetailsWrapper lambdaName={lambda.name} />
      </MockedProvider>,
    );
    expect(component.find(Spinner)).toHaveLength(1);

    await componentUpdate(component);

    expect(component.find(Spinner)).toHaveLength(0);
  });
});

import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MockedProvider } from '@apollo/react-testing';
import { Spinner } from 'react-shared';

import { lambda } from './gqlMocks';
import { componentUpdate } from '../../../../../../../testing';
import ServiceBindingsWrapper from '../ServiceBindingsWrapper';

jest.mock('@kyma-project/luigi-client', () => {
  return {
    getEventData: () => ({ environmentId: 'testnamespace' }),
  };
});

describe('ServiceBindingsWrapper', () => {
  it('Renders with an error in no lambdaName is provided', async () => {
    console.error = jest.fn();
    let component;
    await renderer.act(async () => {
      component = renderer.create(
        <MockedProvider>
          <ServiceBindingsWrapper />
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
        <ServiceBindingsWrapper lambdaName={lambda.name} />
      </MockedProvider>,
    );
    expect(component.find(Spinner)).toHaveLength(1);
    await componentUpdate(component);
    expect(component.find(Spinner)).toHaveLength(0);
  });
});

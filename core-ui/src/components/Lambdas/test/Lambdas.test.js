import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { allLambdasQuery } from '../../../testing/queriesMocks';
import { MockedProvider } from '@apollo/react-testing';
import { componentUpdate } from '../../../testing';

import Lambdas from './../Lambdas';
import Spinner from '../../../shared/components/Spinner/Spinner';

describe('Lambdas', () => {
  it('Renders with error in no query is mocked', async () => {
    let component;
    await renderer.act(async () => {
      component = renderer.create(
        <MockedProvider>
          <Lambdas />
        </MockedProvider>,
      );
    });
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Shows loading indicator only when data is not yet loaded', async () => {
    const component = mount(
      <MockedProvider>
        <Lambdas />
      </MockedProvider>,
    );
    expect(component.find(Spinner)).toHaveLength(1);

    await componentUpdate(component);

    expect(component.find(Spinner)).toHaveLength(0);
  });

  it('Displays lambdas with their corresponding names in the table', async () => {
    const component = mount(
      <MockedProvider mocks={[allLambdasQuery]}>
        <Lambdas />
      </MockedProvider>,
    );

    await componentUpdate(component);

    const displayedLambdaNames = component.find('[data-test-id="lambda-name"]');

    expect(displayedLambdaNames).toHaveLength(2);
    expect(displayedLambdaNames.at(0).exists()).toBe(true);
    expect(displayedLambdaNames.at(1).exists()).toBe(true);
    expect(displayedLambdaNames.at(0).text()).toEqual('demo');
    expect(displayedLambdaNames.at(1).text()).toEqual('demo2');
  });
});

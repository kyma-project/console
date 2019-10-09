import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import { allLambdasQuery } from '../../../testing/queriesMocks';
import { MockedProvider } from '@apollo/react-testing';
import { createMockLink } from '../../../testing/apollo';
import { componentUpdate } from '../../../testing';
import { act } from 'react-dom/test-utils';

import Lambdas from './../Lambdas';
import {
  Button,
  Spinner,
  TableWithActionsList,
} from '@kyma-project/react-components';
import GenericList from '../../../shared/components/GenericList/GenericList';

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
    const { link } = createMockLink([]);
    let component;

    component = mount(
      <MockedProvider link={link}>
        <Lambdas />
      </MockedProvider>,
    );
    expect(component.find(Spinner)).toHaveLength(1);

    await componentUpdate(component);

    expect(component.find(Spinner)).toHaveLength(0);
  });

  it('Displays lambdas with their corresponding names in the table', async () => {
    const { link } = createMockLink([allLambdasQuery]);
    const component = mount(
      <MockedProvider link={link}>
        <Lambdas />
      </MockedProvider>,
    );

    await componentUpdate(component);
    const table = component.find(TableWithActionsList);
    expect(table.exists()).toBe(true);

    const rowData = table.prop('entries');
    expect(rowData).toHaveLength(2);

    const displayedLambdaNames = table.find('[data-test-id="lambda-name"]');

    expect(displayedLambdaNames).toHaveLength(2);
    expect(displayedLambdaNames.at(0).exists()).toBe(true);
    expect(displayedLambdaNames.at(1).exists()).toBe(true);
    expect(displayedLambdaNames.at(0).text()).toEqual('demo');
    expect(displayedLambdaNames.at(1).text()).toEqual('demo2');
  });
});

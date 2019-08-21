import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import { mocks } from './mock';
import { ActionBar } from 'fundamental-react';
import { Panel } from '@kyma-project/react-components';
import MetadataDefinitionDetails from '../MetadataDefinitionDetails.container';
import JSONEditorComponent from '../../../Shared/JSONEditor';

describe('MetadataDefinitionDetails UI', () => {
  console.error = jest.fn();
  console.warn = jest.fn();
  afterEach(() => {
    console.error.mockReset();
    console.warn.mockReset();
  });

  it(`Renders "Loading name..." when there's no GQL response`, async () => {
    const component = mount(
      <MockedProvider addTypename={false}>
        <MetadataDefinitionDetails definitionKey="noschemalabel" />
      </MockedProvider>,
    );

    await wait(0); // wait for response

    expect(component.find(ActionBar.Header).text()).toEqual('Loading name...');
  });

  it(`Renders the name `, async () => {
    const component = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MetadataDefinitionDetails definitionKey="noschemalabel" />
      </MockedProvider>,
    );

    await wait(0); // wait for response

    component.update();
    expect(component.find(ActionBar.Header).text()).toEqual(
      mocks[0].result.data.labelDefinition.key,
    );
    expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
  });

  it(`Clicking "Save" triggers the mutation`, async () => {
    const component = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MetadataDefinitionDetails definitionKey="noschemalabel" />
      </MockedProvider>,
    );

    await wait(0); // wait for response
    expect(mocks[2].result.mock.calls.length).toEqual(0);

    component.find('.fd-button--emphasized').simulate('click');

    await wait(0); // wait for response

    expect(mocks[2].result.mock.calls.length).toEqual(1);

    expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
    expect(console.warn.mock.calls[0][0]).toMatchSnapshot(); // Apollo's @client warning because of Notification
  });

  describe('The schema is provided', () => {
    it(`Renders panel with toggle set to on `, async () => {
      const component = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MetadataDefinitionDetails definitionKey="labelWithInvalidSchema" />
        </MockedProvider>,
      );

      await wait(0); // wait for response

      component.update();

      expect(
        component
          .find(Panel)
          .find('Toggle')
          .prop('checked'),
      ).toEqual(true);
      expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
    });

    it(`Renders JSON editor`, async () => {
      const component = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MetadataDefinitionDetails definitionKey="labelWithInvalidSchema" />
        </MockedProvider>,
      );

      await wait(0); // wait for response

      component.update();

      expect(component.find(Panel).exists(JSONEditorComponent)).toBeTruthy();
      expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
    });
  });
  describe('The schema is not provided', () => {
    it(`Renders panel with toggle set to off`, async () => {
      const component = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MetadataDefinitionDetails definitionKey="noschemalabel" />
        </MockedProvider>,
      );

      await wait(0); // wait for response

      component.update();

      expect(
        component
          .find(Panel)
          .find('Toggle')
          .prop('checked'),
      ).toBeUndefined();
      expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
    });

    it(`Doesn't render JSON editor`, async () => {
      const component = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MetadataDefinitionDetails definitionKey="noschemalabel" />
        </MockedProvider>,
      );

      await wait(0); // wait for response

      component.update();

      expect(
        component.find(Panel).exists(JSONEditorComponent),
      ).not.toBeTruthy();
      expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
    });
  });
});

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

  describe('The schema is provided', () => {
    let component = null;

    beforeEach(async () => {
      component = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MetadataDefinitionDetails definitionKey="labelWithValidSchema" />
        </MockedProvider>,
      );
      await wait(0); // wait for response
    });

    afterAll(() => {
      expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
      if (console.warn.mock.calls.length) {
        // in case there is a warning, make sure it's the expected one. TODO: remove it
        expect(console.warn.mock.calls[0][0]).toMatchSnapshot(); // Apollo's @client warning because of Notification
      }
    });

    it(`Renders panel with toggle set to on `, async () => {
      component.update();

      expect(
        component
          .find(Panel)
          .find('Toggle')
          .prop('checked'),
      ).toEqual(true);
    });

    it(`Renders JSON editor`, async () => {
      component.update();
      expect(component.find(Panel).exists(JSONEditorComponent)).toBeTruthy();
    });

    it(`Clicking "Save" triggers the mutation`, async () => {
      component.update();
      expect(mocks[4].result.mock.calls.length).toEqual(0);

      component.find('.fd-button--emphasized').simulate('click');
      await wait(0); // wait for response

      expect(mocks[4].result.mock.calls.length).toEqual(1);
    });

    it(`"Save" button is enabled by default`, async () => {
      component.update();

      expect(component.find('.fd-button--emphasized').prop('disabled')).toEqual(
        false,
      );
    });
  });
  describe('The schema is not provided', () => {
    let component;

    beforeEach(async () => {
      component = mount(
        <MockedProvider mocks={mocks} addTypename={false}>
          <MetadataDefinitionDetails definitionKey="noschemalabel" />
        </MockedProvider>,
      );
      await wait(0); // wait for response
    });

    afterAll(() => {
      expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
      if (console.warn.mock.calls.length) {
        // in case there is a warning, make sure it's the expected one. TODO: remove it
        expect(console.warn.mock.calls[0][0]).toMatchSnapshot(); // Apollo's @client warning because of Notification
      }
    });

    it(`Renders panel with toggle set to off`, async () => {
      component.update();
      expect(
        component
          .find(Panel)
          .find('Toggle')
          .prop('checked'),
      ).toBeUndefined();
      //   expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
    });

    it(`Doesn't render JSON editor`, async () => {
      component.update();
      expect(
        component.find(Panel).exists(JSONEditorComponent),
      ).not.toBeTruthy();
    });

    it(`Clicking "Save" triggers the mutation`, async () => {
      expect(mocks[3].result.mock.calls.length).toEqual(0);

      component.find('.fd-button--emphasized').simulate('click');
      await wait(0); // wait for response

      expect(mocks[3].result.mock.calls.length).toEqual(1);
    });
    it(`JSONeditor is invisible after toggle is clicked`, async () => {
      component.update();

      expect(component.exists(JSONEditorComponent)).not.toBeTruthy();
      component
        .find('Toggle')
        .find('input')
        .simulate('change', { target: { checked: true } });
      await wait(0);
      component.update();

      expect(component.exists(JSONEditorComponent)).toBeTruthy();
    });
  });
});

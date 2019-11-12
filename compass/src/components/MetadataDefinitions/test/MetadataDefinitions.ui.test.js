import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import { mocks } from './mock';

import MetadataDefinitions from '../MetadataDefinitions.container';
import { GenericList } from 'react-shared';

describe('MetadataDefinitions UI', () => {
  it(`Renders "loading" when there's no GQL response`, async () => {
    const component = mount(
      <MockedProvider addTypename={false}>
        <MetadataDefinitions />
      </MockedProvider>,
    );

    await wait(0); // wait for response

    expect(component.text()).toEqual('Loading...');
    expect(component.exists(GenericList)).not.toBeTruthy(); // there's no list displayed
  });

  it(`Renders the table `, async () => {
    const component = mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MetadataDefinitions />
      </MockedProvider>,
    );

    await wait(0); // wait for response

    component.update();
    expect(component.exists(GenericList)).toBeTruthy(); // there is a list displayed
  });
});

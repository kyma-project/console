import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import { validMock, errorMock } from './mock';
import { act } from 'react-dom/test-utils';

import ConnectApplicationModal from '../ConnectApplicationModal.container';

describe('ConnectApplicationModal Container', () => {
  // for "Warning: componentWillReceiveProps has been renamed"
  console.error = jest.fn();
  console.warn = jest.fn();

  afterEach(() => {
    console.error.mockReset();
    console.warn.mockReset();
  });

  afterAll(() => {
    expect(console.error.mock.calls[0][0]).toMatchSnapshot();
    if (console.warn.mock.calls.length) {
      expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
    }
  });

  const openModal = async component => {
    await component
      .find('[data-test-id="open-modal"]')
      .first()
      .simulate('click');
    component.update();
  };

  it('Modal is in "loading" state after open', async () => {
    const component = mount(
      <MockedProvider addTypename={false} mocks={validMock}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    await act(async () => await openModal(component));

    expect(component.find('input#token').instance().value).toEqual(
      'Loading...',
    );
    expect(component.find('input#connector-url').instance().value).toEqual(
      'Loading...',
    );
  });

  it('Modal renders valid state after loading data', async () => {
    const component = mount(
      <MockedProvider addTypename={false} mocks={validMock}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    await act(async () => await openModal(component));

    await wait(0); // wait for gql response
    component.update();

    expect(component.find('input#token').instance().value).toEqual(
      'sample token',
    );
    expect(component.find('input#connector-url').instance().value).toEqual(
      'sample connector url',
    );
  });

  it('Modal renders error state on error response', async () => {
    const component = mount(
      <MockedProvider addTypename={false} mocks={errorMock}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    await act(async () => await openModal(component));

    await wait(0); // wait for gql response
    component.update();

    const errorMessage = component.find(
      '.fd-form__message.fd-form__message--error',
    );
    expect(errorMessage).toBeTruthy();
    expect(errorMessage.text()).toEqual('Network error: sample error');
  });
});

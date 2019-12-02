import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import { validMock, errorMock } from './mock';
import { Modal } from 'fundamental-react';
import { act } from 'react-dom/test-utils';

import ConnectApplicationModal from '../ConnectApplicationModal.container';

describe('ConnectApplicationModal Container', () => {
  //for "Warning: componentWillReceiveProps has been renamed"
  console.warn = jest.fn();

  afterEach(() => {
    console.warn.mockReset();
  });

  afterAll(() => {
    if (console.warn.mock.calls.length) {
      expect(console.warn.mock.calls[0][0]).toMatchSnapshot();
    }
  });

  const openModal = async component =>
    await component
      .findWhere(
        t => t.type() == 'button' && t.text() === 'Connect Application',
      )
      .simulate('click');

  it('Modal is initially closed and opens after button click', async () => {
    const component = mount(
      <MockedProvider addTypename={false} mocks={validMock}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    expect(component.find(Modal).getDOMNode()).toBeFalsy();

    await openModal(component);

    expect(component.find(Modal).getDOMNode()).toBeTruthy();
  });

  it('Modal is in "loading" state after open', async () => {
    const component = mount(
      <MockedProvider addTypename={false} mocks={validMock}>
        <ConnectApplicationModal applicationId="app-id" />
      </MockedProvider>,
    );

    await openModal(component);

    const inputs = component
      .findWhere(t => t.type() === 'input')
      .map(i => i.instance().value);
    expect(inputs).toMatchSnapshot();
  });

  // Timeout - Async callback was not invoked within the 5000ms timeout specified by jest.setTimeout.Timeout
  // it('Modal renders valid state after loading data', async () => {
  //   const component = mount(
  //     <MockedProvider mocks={validMock} addTypename={false}>
  //       <ConnectApplicationModal applicationId="app-id" />
  //     </MockedProvider>,
  //   );

  //   await act(async () => {
  //     await openModal(component);
  //     await wait(0);
  //     component.update();
  //   });
  //   const inputs = component
  //     .findWhere(t => t.type() === 'input')
  //     .map(i => i.instance().value);
  //   expect(inputs).toMatchSnapshot();
  // });

  // it('Modal renders error state', async () => {
  //   const component = mount(
  //     <MockedProvider mocks={errorMock} addTypename={false}>
  //       <ConnectApplicationModal applicationId="app-id" />
  //     </MockedProvider>,
  //   );

  //   await act(async () => {
  //     await openModal(component);
  //     await wait(0);
  //     component.update();
  //   });

  //   const inputs = component.findWhere(t => t.type() === 'input'); // inputs should be hidden
  //   expect(inputs.length).toBe(0);
  //   const errors = component.findWhere(
  //     t => t.text() === 'Network error: sample error',
  //   );
  //   expect(errors.length).not.toBe(0);
  // });
});

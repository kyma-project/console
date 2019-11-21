import React from 'react';
import { mount } from 'enzyme';
import { Modal } from 'fundamental-react';
import { act } from 'react-dom/test-utils';

import ConnectApplicationModal from '../ConnectApplicationModal.component';
import { sampleData } from './mock';

describe('ConnectApplicationModal Component', () => {
  it('Modal is initially closed', () => {
    const component = mount(
      <ConnectApplicationModal
        applicationId="app-id"
        connectApplicationMutation={() => {}}
      />,
    );

    expect(component.find(Modal).props().show).toEqual(false);
  });

  it('Modal opens on button click, calling mutation', async () => {
    const mockFunction = jest.fn(() => ({ data: sampleData }));
    const component = mount(
      <ConnectApplicationModal
        applicationId="app-id"
        connectApplicationMutation={mockFunction}
      />,
    );

    await act(async () => {
      await component
        .find('.fd-button--emphasized')
        .first()
        .simulate('click');
      component.update();
    });

    expect(component.find(Modal).props().show).toEqual(true);
    expect(mockFunction).toHaveBeenLastCalledWith('app-id');
  });
});

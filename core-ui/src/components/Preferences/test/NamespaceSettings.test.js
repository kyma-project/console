import React from 'react';
import LuigiClient from '@luigi-project/client';
import { render, fireEvent } from '@testing-library/react';
import NamespaceSettings from '../NamespaceSettings';

let mockGroups = [];
jest.mock('react-shared', () => ({
  useMicrofrontendContext: () => ({
    showSystemNamespaces: true,
    groups: mockGroups,
  }),
}));

describe('NamespaceSettings', () => {
  it('Renders nothing if groups are an array missing runtimeAdmin', () => {
    const { queryByText } = render(<NamespaceSettings />);
    expect(queryByText('Namespace Settings')).not.toBeInTheDocument();
  });

  it('Sends custom message on toggle', () => {
    mockGroups = null;
    const spy = jest.spyOn(LuigiClient, 'sendCustomMessage');
    const { getByLabelText } = render(<NamespaceSettings />);

    fireEvent.click(getByLabelText('toggle-system-namespaces'));

    expect(spy).toHaveBeenCalledWith({
      id: 'console.showSystemNamespaces',
      showSystemNamespaces: false,
    });

    spy.mockRestore();
  });
});

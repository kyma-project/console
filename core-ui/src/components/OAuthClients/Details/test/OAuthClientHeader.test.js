import React from 'react';
import { render } from '@testing-library/react';
import OAuthClientHeader from '../OAuthClientHeader';

describe('OAuthClientHeader', () => {
  it('Renders with minimal props', () => {
    const { queryByText, queryByRole } = render(
      <OAuthClientHeader
        client={{ name: 'client-name' }}
        isEditMode={false}
        canSave={false}
        setEditMode={() => {}}
        updatedSpec={{}}
      />,
    );

    expect(queryByText('client-name')).toBeInTheDocument();
    expect(queryByRole('status')).toBeInTheDocument();
  });

  //   it('Switches between view and edit mode', () => {
  //     const expectViewMode = queryByText => {
  //       expect(queryByText('Edit')).toBeInTheDocument();
  //       expect(queryByText('Delete')).toBeInTheDocument();
  //       expect(queryByText('Save')).not.toBeInTheDocument();
  //       expect(queryByText('Cancel')).not.toBeInTheDocument();
  //     };

  //     const expectEditMode = queryByText => {
  //       expect(queryByText('Save')).toBeInTheDocument();
  //       expect(queryByText('Cancel')).toBeInTheDocument();
  //       expect(queryByText('Edit')).not.toBeInTheDocument();
  //       expect(queryByText('Delete')).not.toBeInTheDocument();
  //     };

  //     const setMode = jest.fn();

  //     const { rerender, queryByText, getByText, debug } = render(
  //       <OAuthClientHeader
  //         client={client}
  //         isEditMode={false}
  //         canSave={false}
  //         setEditMode={setMode}
  //         updatedSpec={{}}
  //       />,
  //     );

  //     expectViewMode(queryByText);
  //     fireEvent.click(getByText('Edit'));
  //     expect(setMode).toHaveBeenCalledWith(true);

  //     // expectEditMode(queryByText);
  //     // fireEvent.click(getByText('Cancel'));
  //     // expect(setMode).toHaveBeenCalledWith(false);

  //     // expectViewMode(queryByText);
  //   });
});

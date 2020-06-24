import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ApiRuleFormHeader from '../ApiRuleFormHeader';

const mockNavigate = jest.fn();
jest.mock('@luigi-project/client', () => ({
  getNodeParams: () => ({ serviceName: 'service-name' }),
  linkManager: () => ({ fromContext: () => ({ navigate: mockNavigate }) }),
}));

describe('ApiRuleFormHeader', () => {
  it('renders link to service if service name is passed in nodeParams', () => {
    const { queryByText } = render(
      <ApiRuleFormHeader
        handleSave={() => {}}
        isValid={true}
        title={'api rule title'}
        saveButtonText={'save'}
        breadcrumbItems={[]}
      />,
    );

    expect(queryByText('service-name')).toBeInTheDocument();
  });

  it('navigates to service on service name click', () => {
    const { getByText } = render(
      <ApiRuleFormHeader
        handleSave={() => {}}
        isValid={true}
        title={'api rule title'}
        saveButtonText={'save'}
        breadcrumbItems={[]}
      />,
    );

    fireEvent.click(getByText('service-name'));
    expect(mockNavigate).toHaveBeenCalled();
  });
});

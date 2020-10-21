import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import ResourceQuotas from '../ResourceQuotas';
import { YamlEditorContext } from 'react-shared';

describe('ResourceQuotas', () => {
  const mockResourceQuotas = [
    {
      name: 'supa-quota',
      json: { test: true },
      spec: {
        hard: { pods: 3, limits: { memory: '2Gi' } },
      },
    },
  ];

  it("Renders 'No entries' when it should", () => {
    const { getByText } = render(<ResourceQuotas resourceQuotas={[]} />);
    expect(getByText('No resource quotas')).toBeInTheDocument();
  });

  it("Renders entries' data", () => {
    const { queryByText } = render(
      <ResourceQuotas resourceQuotas={mockResourceQuotas} />,
    );

    expect(queryByText('supa-quota')).toBeInTheDocument();
    expect(queryByText('3')).toBeInTheDocument();
    expect(queryByText('2Gi')).toBeInTheDocument();
  });

  it("Renders '-' for unknown fields", () => {
    const { queryAllByText } = render(
      <ResourceQuotas resourceQuotas={mockResourceQuotas} />,
    );

    expect(queryAllByText('-')).toHaveLength(1); // 'requests' memory value is unknown
  });

  it('Opens the yaml editor drawer on edit', async () => {
    const mockYamlEditorHook = jest.fn();

    const { getByLabelText } = render(
      <YamlEditorContext.Provider value={mockYamlEditorHook}>
        <ResourceQuotas resourceQuotas={mockResourceQuotas} />
      </YamlEditorContext.Provider>,
    );
    const editBtn = getByLabelText('Edit');

    expect(mockYamlEditorHook).not.toHaveBeenCalled();

    fireEvent.click(editBtn);

    await wait(() => {
      expect(mockYamlEditorHook).toHaveBeenCalledWith(
        mockResourceQuotas[0].json,
        expect.any(Function),
      );
    });
  });
});

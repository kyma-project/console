import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import LimitRanges from '../LimitRanges';
import { YamlEditorContext } from 'react-shared';

describe('LimitRanges', () => {
  const mockLimitRanges = [
    {
      name: 'big-limit',
      json: { test: true },
      spec: {
        limits: [{ type: 'Container', default: { memory: '2Gi', cpu: null } }],
      },
    },
  ];

  it("Renders 'No entries' when it should", () => {
    const { getByText } = render(<LimitRanges limitRanges={[]} />);
    expect(getByText('No limit ranges')).toBeInTheDocument();
  });

  it("Renders entries' data", () => {
    const { queryByText } = render(
      <LimitRanges limitRanges={mockLimitRanges} />,
    );

    expect(queryByText('big-limit')).toBeInTheDocument();
    expect(queryByText('Container')).toBeInTheDocument();
    expect(queryByText('2Gi')).toBeInTheDocument();
  });

  it("Renders '-' for unknown fields", () => {
    const { queryAllByText } = render(
      <LimitRanges limitRanges={mockLimitRanges} />,
    );

    expect(queryAllByText('-')).toHaveLength(2); // 'defaultRequest' and 'max' memory values are unknown
  });

  it('Opens the yaml editor drawer on edit', async () => {
    const mockYamlEditorHook = jest.fn();

    const { getByLabelText } = render(
      <YamlEditorContext.Provider value={mockYamlEditorHook}>
        <LimitRanges limitRanges={mockLimitRanges} />
      </YamlEditorContext.Provider>,
    );
    const editBtn = getByLabelText('Edit');

    expect(mockYamlEditorHook).not.toHaveBeenCalled();

    fireEvent.click(editBtn);

    await wait(() => {
      expect(mockYamlEditorHook).toHaveBeenCalledWith(
        mockLimitRanges[0].json,
        expect.any(Function),
      );
    });
  });
});

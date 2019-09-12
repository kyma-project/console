import React from 'react';
import { mount } from 'enzyme';
import AdvancedSettings from './../AdvancedSettings';

const sampleAdvancedSettings = {
  query: 'query',
  resultLimit: 10,
  showPreviousLogs: true,
  showHealthChecks: true,
};

describe('AdvancedSettings UI', () => {
  it('Clicking close button triggers callback', () => {
    const mockCallback = jest.fn();
    const component = mount(
      <AdvancedSettings
        advancedSettings={sampleAdvancedSettings}
        hideSettings={mockCallback}
        updateFilteringState={() => {}}
      />,
    );

    const target = component
      .find('.advanced_settings__header')
      .find('Icon')
      .find('span');

    target.simulate('click');
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('Changing "Show previous logs" triggers callback', () => {
    const mockCallback = jest.fn();
    const component = mount(
      <AdvancedSettings
        advancedSettings={sampleAdvancedSettings}
        hideSettings={() => {}}
        updateFilteringState={mockCallback}
      />,
    );

    const checkbox = component.find('#previous-logs');

    checkbox.simulate('change', { target: { checked: false } });
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(
      mockCallback.mock.calls[0][0].advancedSettings.showPreviousLogs,
    ).toBe(false);

    checkbox.simulate('change', { target: { checked: true } });
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(
      mockCallback.mock.calls[1][0].advancedSettings.showPreviousLogs,
    ).toBe(true);
  });

  it('Changing "Show health checks" triggers callback', () => {
    const mockCallback = jest.fn();
    const component = mount(
      <AdvancedSettings
        advancedSettings={sampleAdvancedSettings}
        hideSettings={() => {}}
        updateFilteringState={mockCallback}
      />,
    );

    const checkbox = component.find('#health-checks');

    checkbox.simulate('change', { target: { checked: false } });
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(
      mockCallback.mock.calls[0][0].advancedSettings.showHealthChecks,
    ).toBe(false);

    checkbox.simulate('change', { target: { checked: true } });
    expect(mockCallback).toHaveBeenCalledTimes(2);
    expect(
      mockCallback.mock.calls[1][0].advancedSettings.showHealthChecks,
    ).toBe(true);
  });

  it('Changing "Result limit" triggers callback', () => {
    const mockCallback = jest.fn();
    const component = mount(
      <AdvancedSettings
        advancedSettings={sampleAdvancedSettings}
        hideSettings={() => {}}
        updateFilteringState={mockCallback}
      />,
    );

    const checkbox = component.find('input#result-limit');

    checkbox.simulate('change', { target: { value: 12 } });
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback.mock.calls[0][0].advancedSettings.resultLimit).toBe(12);
  });

  it('Changing "Query" triggers callback', () => {
    const mockCallback = jest.fn();
    const component = mount(
      <AdvancedSettings
        advancedSettings={sampleAdvancedSettings}
        hideSettings={() => {}}
        updateFilteringState={mockCallback}
      />,
    );

    const checkbox = component.find('input#query');

    checkbox.simulate('change', { target: { value: 'foo' } });
    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback.mock.calls[0][0].advancedSettings.query).toBe('foo');
  });
});

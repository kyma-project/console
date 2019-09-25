import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import LabelsDisplay from './../LabelsDisplay';
import {
  SearchParamsContext,
  defaultSearchParams,
  actions,
  SET_LABELS,
} from '../../../Logs/SearchParams.reducer';

describe('LabelDisplay', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <SearchParamsContext.Provider
        value={[
          {
            ...defaultSearchParams,
            labels: ['a', 'b'],
            readonlyLabels: ['c', 'd'],
          },
          actions(jest.fn()),
        ]}
      >
        <LabelsDisplay />
      </SearchParamsContext.Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Does not show "Clear All" button when labels are not provided', () => {
    const component = mount(
      <SearchParamsContext.Provider
        value={[defaultSearchParams, actions(jest.fn())]}
      >
        <LabelsDisplay
          labels={[]}
          readonlyLabels={[]}
          removeLabel={() => {}}
          removeAll={() => {}}
        />
      </SearchParamsContext.Provider>,
    );
    expect(component.exists('span[data-test-id="clear-all"]')).not.toBeTruthy();
  });

  it('Clicking label triggers callback', () => {
    const mockCallback = jest.fn();

    const component = mount(
      <SearchParamsContext.Provider
        value={[
          { ...defaultSearchParams, labels: ['a', 'b'] },
          actions(mockCallback),
        ]}
      >
        <LabelsDisplay />
      </SearchParamsContext.Provider>,
    );
    component
      .find('Token')
      .first()
      .simulate('click');

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith({
      type: SET_LABELS,
      value: ['b'],
    });
  });

  it('Clicking "Remove All" button triggers "removeAll" callback', () => {
    const mockCallback = jest.fn();
    const component = mount(
      <SearchParamsContext.Provider
        value={[
          {
            ...defaultSearchParams,
            labels: ['a', 'b'],
            readonlyLabels: ['c', 'd'],
          },
          actions(mockCallback),
        ]}
      >
        <LabelsDisplay />
      </SearchParamsContext.Provider>,
    );
    component.find('[data-test-id="clear-all"]').simulate('click');
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});

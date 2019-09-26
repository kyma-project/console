import React from 'react';
import renderer from 'react-test-renderer';
import AdvancedSettings, {
  HealthChecksInput,
  ResultLimitInput,
} from './../AdvancedSettings';
import { LambdaNameContext } from '../../../Logs/Logs';
import * as Logs from '../../../Logs/Logs';
import {
  actions,
  defaultSearchParams,
  SearchParamsContext,
} from '../../../Logs/SearchParams.reducer';
import * as SearchParams from '../../../Logs/SearchParams.reducer';
import { shallow } from 'enzyme';
import { FormInput } from 'fundamental-react';

describe('Renders with minimal props', () => {
  const dispatch = jest.fn();
  const component = renderer.create(
    <SearchParamsContext.Provider
      value={[defaultSearchParams, actions(dispatch)]}
    >
      <LambdaNameContext.Provider value={''}>
        <AdvancedSettings hideSettings={() => {}} />
      </LambdaNameContext.Provider>
    </SearchParamsContext.Provider>,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

describe('HealthChecksInput', () => {
  const dispatch = jest.fn();

  it('Changing "Show health checks" triggers callback', () => {
    const component = shallow(
      <HealthChecksInput
        state={defaultSearchParams}
        actions={actions(dispatch)}
      />,
    );

    const checkbox = component.find('#health-checks');

    checkbox.simulate('change', { target: { checked: false } });
    checkbox.simulate('change', { target: { checked: true } });
    expect(dispatch.mock.calls).toMatchSnapshot();
  });

  test.todo('Hide "Show health checks" if not lambda');
});

describe('ResultLimitInput', () => {
  const dispatch = jest.fn();
  it('Changing "Result limit" triggers callback', () => {
    const component = shallow(
      <ResultLimitInput
        state={defaultSearchParams}
        actions={actions(dispatch)}
      />,
    );

    const checkbox = component.find(FormInput);

    checkbox.simulate('change', { target: { value: 12 } });
    expect(dispatch.mock.calls).toMatchSnapshot();
  });
});

describe('AdvancedSettings', () => {
  const dispatch = jest.fn();

  SearchParams.useSearchParams = jest.fn(() => [
    defaultSearchParams,
    actions(dispatch),
  ]);
  Logs.useLambdaName = jest.fn(() => 'lambda');

  beforeEach(() => {
    dispatch.mockReset();
  });

  it('Clicking close button triggers callback', () => {
    const mockCallback = jest.fn();
    const component = shallow(<AdvancedSettings hideSettings={mockCallback} />);

    const target = component.find('.advanced_settings__header').find('Icon');

    target.simulate('click');
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});

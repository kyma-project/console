import React from 'react';
import renderer from 'react-test-renderer';
import Header from './../Header';
import {
  actions,
  defaultSearchParams,
  SearchParamsContext,
} from '../../Logs/SearchParams.reducer';
import { shallow, render, mount } from 'enzyme';
import * as SearchParams from '../../Logs/SearchParams.reducer';

describe('Header', () => {
  console.error = jest.fn();
  const dispatch = jest.fn();

  const searchParams = {
    ...defaultSearchParams,
    searchPhrase: 'search phrase',
    readonlyLabels: ['a', 'b'],
    labels: ['a', 'b'],
  };

  afterEach(() => {
    console.error.mockReset();
    dispatch.mockReset();
  });

  afterAll(() => {
    expect(console.error.mock.calls[0][0]).toMatchSnapshot(); // unique "key" prop warning
  });

  it('Renders with minimal props', () => {
    const component = renderer.create(
      <SearchParamsContext.Provider value={[searchParams, actions(dispatch)]}>
        <Header />
      </SearchParamsContext.Provider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Shows / hides advanced settings when corresponding button is clicked', () => {
    SearchParams.useSearchParams = jest.fn(() => [
      searchParams,
      actions(dispatch),
    ]);

    const component = shallow(<Header />);

    const link = component
      .find('span[data-test-id="advanced-settings-toggle"]')
      .first();

    link.simulate('click');
    expect(component).toMatchSnapshot();

    link.simulate('click');
    expect(component).toMatchSnapshot();
  });
});

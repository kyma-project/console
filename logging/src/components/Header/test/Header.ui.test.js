import React from 'react';
import { shallow } from 'enzyme';
import Header from './../Header';
import toJson from 'enzyme-to-json';

describe('Header UI', () => {
  it('Shows / hides advanced settings when corresponding button is clicked', () => {
    const component = shallow(
      <Header
        updateFilteringState={() => {}}
        searchPhrase="search phrase"
        labels={['a', 'b']}
        sortDirection="ascending"
        readonlyLabels={['c', 'd']}
        advancedSettings={{}}
      />,
    );

    const link = component
      .find('span[data-test-id="advanced-settings-toggle"]')
      .first();

    link.simulate('click');
    expect(toJson(component)).toMatchSnapshot();

    link.simulate('click');
    expect(toJson(component)).toMatchSnapshot();
  });
});

import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import LogTable from './../LogTable';

describe('LogTable', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <LogTable
        entries={[
          { timestamp: 'a', log: 'b' },
          { timestamp: 'c', log: 'd' },
          { timestamp: 'e', log: 'f' },
        ]}
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Displays "No entries" button when there are no entries', () => {
    const component = shallow(<LogTable entries={[]} />);
    expect(component.exists('.log-table__no-entries-text')).toBeTruthy();
  });
});

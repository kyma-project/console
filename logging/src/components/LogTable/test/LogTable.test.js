import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import LogTable from './../LogTable';

const sampleEntries = [
  { timestamp: 'a', log: 'b' },
  { timestamp: 'c', log: 'd' },
  { timestamp: 'e', log: 'f' },
];

describe('LogTable', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(<LogTable entries={sampleEntries} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Renders custom title if name is provided', () => {
    const component = renderer.create(
      <LogTable entries={sampleEntries} entityName={'test'} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Displays "No entries" button when there are no entries', () => {
    const component = shallow(<LogTable entries={[]} />);
    expect(component.exists('.log-table__no-entries-text')).toBeTruthy();
  });
});

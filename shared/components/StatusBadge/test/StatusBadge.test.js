import renderer from 'react-test-renderer';
import StatusBadge from '../StatusBadge';
import React from 'react';

describe('StatusBadge', () => {
  it('should render loading state initially', () => {
    const component = renderer.create(<StatusBadge status="INITIAL" />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

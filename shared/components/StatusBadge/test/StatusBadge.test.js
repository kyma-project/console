import renderer from 'react-test-renderer';
import React from 'react';
import { StatusBadge } from '../StatusBadge';

describe('StatusBadge', () => {
  it('should render loading state initially', () => {
    const component = renderer.create(<StatusBadge status="INITIAL" />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

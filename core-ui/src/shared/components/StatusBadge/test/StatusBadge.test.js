import renderer from 'react-test-renderer';
import StatusBadge from '../StatusBadge';
import LambdaStatusBadge from '../LambdaStatusBadge';
import React from 'react';

describe('StatusBadge', () => {
  it('should render loading state initially', () => {
    const component = renderer.create(<StatusBadge status="INITIAL" />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('LambdaStatusBadge', () => {
  it('LambdaStatusBadge should render with status building', () => {
    const component = renderer.create(<LambdaStatusBadge status="Building" />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

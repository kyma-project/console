import renderer from 'react-test-renderer';
import LambdaStatusBadge from '../LambdaStatusBadge';
import React from 'react';

describe('LambdaStatusBadge', () => {
  it('LambdaStatusBadge should render with status building', () => {
    const component = renderer.create(<LambdaStatusBadge status="Building" />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

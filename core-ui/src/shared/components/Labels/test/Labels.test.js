import renderer from 'react-test-renderer';
import Labels from '../Labels';
import React from 'react';

describe('Labels', () => {
  it('Labels should render with no labels', () => {
    const component = renderer.create(<Labels />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Labels should render with labels', () => {
    const component = renderer.create(
      <Labels labels={{ testLabel: 'testValue' }} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

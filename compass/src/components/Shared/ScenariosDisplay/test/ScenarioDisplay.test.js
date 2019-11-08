import React from 'react';
import renderer from 'react-test-renderer';
import ScenariosDisplay from '../ScenariosDisplay';

describe('ScenariosDisplay', () => {
  it('Renders scenario list', () => {
    const component = renderer.create(
      <ScenariosDisplay scenarios={['a', 'b', 'c']} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Renders default placeholder when there are no scenarios', () => {
    const component = renderer.create(<ScenariosDisplay scenarios={[]} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Renders custom placeholder when there are no scenarios', () => {
    const component = renderer.create(
      <ScenariosDisplay scenarios={[]} emptyPlaceholder={'No scenarios'} />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Renders custom class name', () => {
    const component = renderer.create(
      <ScenariosDisplay scenarios={['a', 'b', 'c']} className="class-name" />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

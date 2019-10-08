import React from 'react';
import renderer from 'react-test-renderer';
import ScenarioDetailsHeader from '../ScenarioDetailsHeader';

describe('ScenarioDetailsHeader', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <ScenarioDetailsHeader scenarioName={'scenario'} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

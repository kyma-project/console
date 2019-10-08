import React from 'react';
import renderer from 'react-test-renderer';
import ScenarioApplications from '../ScenarioApplications';

describe('ScenarioApplications', () => {
  it('Renders with minimal props', () => {
    const component = renderer.create(
      <ScenarioApplications scenarioName={'scenario'} />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

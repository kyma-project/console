import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

import ScenarioApplications from '../ScenarioApplications.component';
import { responseMock } from './mock';
jest.mock('react-shared', () => ({
  GenericList: function GenericListMocked(props) {
    return 'generic-list-mocked-content';
  },
}));
describe('ScenarioApplications', () => {
  it('Renders with minimal props', () => {
    const component = shallow(
      <ScenarioApplications
        scenarioName="scenario name"
        getApplicationsForScenario={responseMock}
        removeApplicationFromScenario={() => {}}
        sendNotification={() => {}}
      />,
    );

    expect(toJson(component)).toMatchSnapshot();
  });
});

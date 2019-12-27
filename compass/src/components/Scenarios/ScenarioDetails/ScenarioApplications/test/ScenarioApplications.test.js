import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { MockedProvider } from '@apollo/react-testing';

import ScenarioApplications from '../ScenarioApplications';
import { responseMock } from './mock';
jest.mock('react-shared', () => ({
  GenericList: function GenericListMocked(props) {
    return 'generic-list-mocked-content';
  },
}));
describe('ScenarioApplications', () => {
  it('Renders with minimal props', () => {
    const component = shallow(
      <MockedProvider addTypename={false}>
        <ScenarioApplications
          scenarioName="scenario name"
          getApplicationsForScenario={responseMock}
          removeApplicationFromScenario={() => {}}
          sendNotification={() => {}}
        />
      </MockedProvider>,
    );

    expect(toJson(component)).toMatchSnapshot();
  });
});

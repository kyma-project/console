import renderer from 'react-test-renderer';
import { MockedProvider } from 'react-apollo/test-utils';
import Applications from '../Applications.container';
import ApplicationsComponent from '../Applications.component';
import React from 'react';
import { GET_APPLICATIONS_MOCK, MOCKED_DATA } from './mock';
import { shallow } from 'enzyme';

describe('Applications', () => {
  it('should render loading state initially', () => {
    const component = renderer.create(
      <MockedProvider mocks={GET_APPLICATIONS_MOCK} addTypename={false}>
        <Applications />
      </MockedProvider>,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  describe('processStatus()', () => {
    const component = shallow(
      <ApplicationsComponent applications={MOCKED_DATA} />,
    );
    const processStatusFn = component.instance().processStatus;

    it('Renders proper <Badge> when no prop is provided', async () => {
      expect(processStatusFn()).toMatchSnapshot();
    });

    it('Renders proper <Badge> when INITIAL prop is provided', async () => {
      expect(processStatusFn('INITIAL')).toMatchSnapshot();
    });

    it('Renders proper <Badge> when ERROR prop is provided', async () => {
      expect(processStatusFn('ERROR')).toMatchSnapshot();
    });
  });
});

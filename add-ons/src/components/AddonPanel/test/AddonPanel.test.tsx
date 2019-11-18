import React from 'react';
import AddonPanel from './../AddonPanel';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Configuration } from '../../../types';
import AddUrlModalContainer from '../../Modals/AddUrlModal/AddUrlModal.container';

const configMock: Configuration = {
  name: 'configuration',
  urls: [],
  labels: {},
  repositories: [],
  status: {
    phase: 'ready',
    repositories: [],
  },
};

describe('AddonPanel', () => {
  it('Renders with minimal props', () => {
    const component = shallow(<AddonPanel config={configMock} />);
    expect(toJson(component)).toMatchSnapshot();
  });

  it('Does not render AddUrl button when config has managed=true label', () => {
    const component = shallow(
      <AddonPanel config={{ ...configMock, labels: { managed: 'true' } }} />,
    );
    expect(component.dive().exists(AddUrlModalContainer)).toBe(false);
  });

  it('Does not render AddUrl button when config has prefixed managed=true label', () => {
    const component = shallow(
      <AddonPanel
        config={{ ...configMock, labels: { 'dns-prefix/managed': 'true' } }}
      />,
    );
    expect(component.dive().exists(AddUrlModalContainer)).toBe(false);
  });
});

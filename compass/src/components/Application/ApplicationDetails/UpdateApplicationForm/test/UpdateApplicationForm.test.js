import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { mount } from 'enzyme';
import {
  validApplicationsQueryMock,
  invalidApplicationsQueryMock,
  applicationMock,
} from './mock';
import toJson from 'enzyme-to-json';

import UpdateApplicationForm from '../UpdateApplicationForm.container';

describe('UpdateApplicationForm UI', () => {
  const emptyRef = { current: null };

  it('Displays "loading" when there is no gql response', async () => {
    const component = mount(
      <MockedProvider addTypename={false} mocks={[]}>
        <UpdateApplicationForm
          formElementRef={emptyRef}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={() => {}}
          application={applicationMock}
        />
      </MockedProvider>,
    );

    expect(component.text()).toEqual('Loading...');
  });

  it('Displays error in error state', async () => {
    const component = mount(
      <MockedProvider
        addTypename={false}
        mocks={[invalidApplicationsQueryMock]}
      >
        <UpdateApplicationForm
          formElementRef={emptyRef}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={() => {}}
          application={applicationMock}
        />
      </MockedProvider>,
    );

    await wait(0); // wait for response

    expect(component.text()).toEqual('Error! Network error: Query error');
  });

  it('Renders form after load', async () => {
    const component = mount(
      <MockedProvider addTypename={false} mocks={[validApplicationsQueryMock]}>
        <UpdateApplicationForm
          formElementRef={emptyRef}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={() => {}}
          application={applicationMock}
        />
      </MockedProvider>,
    );

    await wait(0); // wait for response
    component.update();

    const tree = toJson(component);
    expect(tree).toMatchSnapshot();
  });

  it('Displays validation messages', async () => {
    const component = mount(
      <MockedProvider addTypename={false} mocks={[validApplicationsQueryMock]}>
        <UpdateApplicationForm
          formElementRef={emptyRef}
          onChange={() => {}}
          onCompleted={() => {}}
          onError={() => {}}
          application={applicationMock}
        />
      </MockedProvider>,
    );

    await wait(0); // wait for response
    component.update();

    const nameInput = component.find('#application-name');

    // initial state
    expect(nameInput.instance().validationMessage).toEqual('');

    // duplicate app name
    nameInput.instance().value = 'app2';
    nameInput.simulate('change');
    expect(nameInput.instance().validationMessage).toEqual(
      'Application with this name already exists.',
    );

    // empty
    nameInput.instance().value = '';
    nameInput.simulate('change');
    expect(nameInput.instance().validationMessage).toEqual(
      'Constraints not satisfied',
    );

    // valid name
    nameInput.instance().value = 'app3';
    nameInput.simulate('change');
    expect(nameInput.instance().validationMessage).toEqual('');
  });
});

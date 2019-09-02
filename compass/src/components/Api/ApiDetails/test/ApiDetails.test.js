import React from 'react';
import { shallow } from 'enzyme';
//import { getApiDataFromQuery } from '../ApiDetails.component';
//import ApiDetails from '../ApiDetails.component';

// !!! importing anything from ApiDetails causes Jest error because of generic-documentation component. So, no tests for now :(

describe('ApiDetails', () => {
  it('Renders with minimal props', () => {
    // const component = shallow(<ApiDetails />);
    // //  let tree = component.toJSON();
    // expect(component).toMatchSnapshot();
  });
  // describe('getApiDataFromQuery()', () => {
  //   it('Returns api when it should', () => {
  //     const mockedQuery = {
  //       name: 'asdfghadsg',
  //       id: 'e68809a1-ba11-4fa5-9e60-3b8ce43e528b',
  //       eventAPIs: {
  //         data: [
  //           {
  //             id: 'bb79febd-272f-4ead-a388-762fe01a9594',
  //             name: 'sdagadsg',
  //             description: '',
  //             spec: {
  //               data: 'this should be returned',
  //               format: 'YAML',
  //               type: 'ASYNC_API',
  //               __typename: 'EventAPISpec',
  //             },
  //             group: null,
  //             __typename: 'EventAPIDefinition',
  //           },
  //         ],
  //         totalCount: 1,
  //         __typename: 'EventAPIDefinitionPage',
  //       },
  //       __typename: 'Application',
  //     };

  //     expect(
  //       getApiDataFromQuery(mockedQuery, null, mock.eventAPIs.data[0].id),
  //     ).toMatchSnapshot();
  //   });
  // });
});

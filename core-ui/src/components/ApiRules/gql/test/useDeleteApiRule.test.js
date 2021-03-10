// import React from 'react';
// import { render, wait, fireEvent } from '@testing-library/react';

// import {
//   withApolloMockProvider,
//   withNotificationProvider,
//   TESTING_STATE,
//   BUTTON_TEST_ID,
//   MutationComponent,
// } from 'components/Lambdas/helpers/testing';
// import { formatMessage } from 'components/Lambdas/helpers/misc';
// import { GQL_MUTATIONS } from '../../constants';

// import { useDeleteApiRule } from '../useDeleteApiRule';
// import {
//   DELETE_API_RULE_DATA_MOCK,
//   DELETE_API_RULE_ERROR_MOCK,
// } from '../mocks/useDeleteApiRule';

// jest.mock('@luigi-project/client', () => {
//   return {
//     uxManager: () => ({
//       showConfirmationModal: () => {
//         return new Promise(resolve => resolve());
//       },
//       addBackdrop: () => {},
//       removeBackdrop: () => {},
//     }),
//     getContext: () => ({
//       namespaceId: 'namespace',
//     }),
//   };
// });

describe('useDeleteApiRule', () => {
  test.todo('useDeleteApiRule');
  //   const name = 'apiRuleName';
  //   const variables = {
  //     namespace: 'namespace',
  //     name,
  //   };
  //   const hookInput = () => {};

  //   it('should see notification if there is a success', async () => {
  //     const mockProvider = withApolloMockProvider({
  //       component: (
  //         <MutationComponent
  //           hook={useDeleteApiRule}
  //           mutationInput={name}
  //           hookInput={hookInput}
  //         />
  //       ),
  //       mocks: [DELETE_API_RULE_DATA_MOCK(variables)],
  //     });

  //     const { getByText, getByTestId } = render(
  //       withNotificationProvider({
  //         component: mockProvider,
  //       }),
  //     );

  //     const button = getByTestId(BUTTON_TEST_ID);
  //     fireEvent.click(button);

  //     await wait(() => {
  //       expect(
  //         getByText(GQL_MUTATIONS.DELETE_API_RULE.SUCCESS_MESSAGE),
  //       ).toBeInTheDocument();
  //     });
  //   });

  //   it('should see notification if there is an error', async () => {
  //     const mockProvider = withApolloMockProvider({
  //       component: (
  //         <MutationComponent
  //           hook={useDeleteApiRule}
  //           mutationInput={name}
  //           hookInput={hookInput}
  //         />
  //       ),
  //       mocks: [DELETE_API_RULE_ERROR_MOCK(variables)],
  //     });

  //     const { getByText, getByTestId } = render(
  //       withNotificationProvider({
  //         component: mockProvider,
  //       }),
  //     );

  //     const message = formatMessage(GQL_MUTATIONS.DELETE_API_RULE.ERROR_MESSAGE, {
  //       error: `Network error: ${TESTING_STATE.ERROR}`,
  //     });

  //     const button = getByTestId(BUTTON_TEST_ID);
  //     fireEvent.click(button);

  //     await wait(() => {
  //       expect(getByText(message)).toBeInTheDocument();
  //     });
  //   });
});

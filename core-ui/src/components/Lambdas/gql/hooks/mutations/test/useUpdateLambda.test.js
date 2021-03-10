// import React from 'react';
// import { render, fireEvent, wait } from '@testing-library/react';

// import {
//   MutationComponent,
//   withApolloMockProvider,
//   withNotificationProvider,
//   TESTING_STATE,
//   BUTTON_TEST_ID,
//   lambdaMock,
// } from 'components/Lambdas/helpers/testing';
// import { formatMessage } from 'components/Lambdas/helpers/misc';
// import { GQL_MUTATIONS } from 'components/Lambdas/constants';

// import {
//   useUpdateLambda,
//   UPDATE_TYPE,
//   prepareUpdateLambdaInput,
// } from '../useUpdateLambda';
// import {
//   UPDATE_LAMBDA_ERROR_MOCK,
//   UPDATE_LAMBDA_DATA_MOCK,
// } from '../testMocks';

describe('useUpdateLambda', () => {
  test.todo('useUpdateLambda');
  //   const hookInput = {
  //     lambda: lambdaMock,
  //     type: UPDATE_TYPE.VARIABLES,
  //   };

  //   const params = prepareUpdateLambdaInput(lambdaMock);
  //   const variables = {
  //     name: lambdaMock.name,
  //     namespace: lambdaMock.namespace,
  //     params,
  //   };
  //   const mutationInput = {
  //     env: lambdaMock.env,
  //   };

  //   const gqlMessages = GQL_MUTATIONS.UPDATE_LAMBDA[UPDATE_TYPE.VARIABLES];

  //   it('should see notification with error message if there is an error', async () => {
  //     const mockedCallback = jest.fn();
  //     const mockProvider = withApolloMockProvider({
  //       component: (
  //         <MutationComponent
  //           hook={useUpdateLambda}
  //           hookInput={hookInput}
  //           mutationInput={mutationInput}
  //           userCallback={mockedCallback}
  //         />
  //       ),
  //       mocks: [UPDATE_LAMBDA_ERROR_MOCK(variables)],
  //     });

  //     const { getByText, getByTestId } = render(
  //       withNotificationProvider({
  //         component: mockProvider,
  //       }),
  //     );
  //     expect(mockedCallback).toBeCalledTimes(0);
  //     const message = formatMessage(gqlMessages.ERROR_MESSAGE, {
  //       lambdaName: lambdaMock.name,
  //       error: `Network error: ${TESTING_STATE.ERROR}`,
  //     });

  //     const button = getByTestId(BUTTON_TEST_ID);
  //     fireEvent.click(button);

  //     await wait(() => {
  //       expect(getByText(message)).toBeInTheDocument();
  //     });
  //     expect(mockedCallback).toBeCalledTimes(1);
  //     expect(mockedCallback).toHaveBeenCalledWith({ ok: false });
  //   });

  //   it("should see notification with success message if there isn't an error", async () => {
  //     const mockedCallback = jest.fn();
  //     const mockProvider = withApolloMockProvider({
  //       component: (
  //         <MutationComponent
  //           hook={useUpdateLambda}
  //           hookInput={hookInput}
  //           mutationInput={mutationInput}
  //           userCallback={mockedCallback}
  //         />
  //       ),
  //       mocks: [UPDATE_LAMBDA_DATA_MOCK(variables)],
  //     });

  //     const { getByText, getByTestId } = render(
  //       withNotificationProvider({
  //         component: mockProvider,
  //       }),
  //     );
  //     expect(mockedCallback).toBeCalledTimes(0);
  //     const message = formatMessage(gqlMessages.SUCCESS_MESSAGE, {
  //       lambdaName: lambdaMock.name,
  //     });

  //     const button = getByTestId(BUTTON_TEST_ID);
  //     fireEvent.click(button);

  //     await wait(() => {
  //       expect(getByText(message)).toBeInTheDocument();
  //     });
  //     expect(mockedCallback).toBeCalledTimes(1);
  //     expect(mockedCallback).toHaveBeenCalledWith({ ok: true });
  //   });
});

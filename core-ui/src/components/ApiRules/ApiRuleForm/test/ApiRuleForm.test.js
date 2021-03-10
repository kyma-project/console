// import React from 'react';
// import { render, waitForDomChange, fireEvent } from '@testing-library/react';
// import ApiRuleForm from '../ApiRuleForm';
// import { MockedProvider } from '@apollo/react-testing';
// import { mockNamespace, apiRule, servicesQuery } from './mocks';
// import { supportedMethodsList } from 'components/ApiRules/accessStrategyTypes';

// jest.mock('@kyma-project/common', () => ({
//   getApiUrl: () => 'kyma.cluster.com',
// }));

// jest.mock('@luigi-project/client', () => ({
//   getEventData: () => ({
//     environmentId: mockNamespace,
//   }),
//   getNodeParams: () => ({}),
// }));

describe('ApiRuleForm', () => {
  test.todo('ApiRuleForm');
  //   const mutation = jest.fn();

  //   beforeEach(() => {
  //     mutation.mockReset();
  //   });

  //   it('renders exisitng access strategies', async () => {
  //     const {
  //       queryAllByPlaceholderText,
  //       queryAllByLabelText,
  //       container,
  //     } = render(
  //       <MockedProvider mocks={[servicesQuery]}>
  //         <ApiRuleForm
  //           apiRule={apiRule()}
  //           mutation={mutation}
  //           saveButtonText="Save"
  //           headerTitle="Form"
  //           breadcrumbItems={[]}
  //         />
  //       </MockedProvider>,
  //     );

  //     await waitForDomChange({ container });

  //     const inputs = queryAllByPlaceholderText('Enter the path');
  //     expect(inputs).toHaveLength(apiRule().spec.rules.length);
  //     inputs.forEach((input, idx) => {
  //       expect(input).toHaveValue(apiRule().spec.rules[idx].path);
  //     });

  //     supportedMethodsList.forEach(method =>
  //       verifyMethodCheckboxes(queryAllByLabelText, method),
  //     );

  //     const typeSelects = queryAllByLabelText('Access strategy type');
  //     expect(typeSelects).toHaveLength(apiRule().spec.rules.length);
  //     typeSelects.forEach((typeSelect, idx) => {
  //       expect(typeSelect).toHaveValue(
  //         apiRule().spec.rules[idx].accessStrategies[0].handler,
  //       );
  //     });
  //   });

  //   it('allows to add new access strategy', async () => {
  //     const mutation = jest.fn();
  //     const { queryAllByPlaceholderText, getByText, container } = render(
  //       <MockedProvider mocks={[servicesQuery]}>
  //         <ApiRuleForm
  //           apiRule={apiRule()}
  //           mutation={mutation}
  //           saveButtonText="Save"
  //           headerTitle="Form"
  //           breadcrumbItems={[]}
  //         />
  //       </MockedProvider>,
  //     );

  //     await waitForDomChange({ container });

  //     getByText('Add access strategy').click();

  //     const paths = queryAllByPlaceholderText('Enter the path');
  //     expect(paths).toHaveLength(apiRule().spec.rules.length + 1);

  //     fireEvent.change(paths[apiRule().spec.rules.length], {
  //       target: { value: '/path' },
  //     });

  //     getByText('Save').click();
  //     expect(mutation).toHaveBeenCalledWith({
  //       variables: {
  //         name: apiRule().name,
  //         namespace: mockNamespace,
  //         params: {
  //           ...apiRule().spec,
  //           rules: [
  //             ...apiRule().spec.rules,
  //             {
  //               methods: [],
  //               path: '/path',
  //               accessStrategies: [{ handler: 'allow', config: {} }],
  //             },
  //           ],
  //         },
  //       },
  //     });
  //   });

  //   it('allows to remove access strategy', async () => {
  //     const mutation = jest.fn();
  //     const { getAllByLabelText, getByText, container } = render(
  //       <MockedProvider mocks={[servicesQuery]}>
  //         <ApiRuleForm
  //           apiRule={apiRule()}
  //           mutation={mutation}
  //           saveButtonText="Save"
  //           headerTitle="Form"
  //           breadcrumbItems={[]}
  //         />
  //       </MockedProvider>,
  //     );

  //     await waitForDomChange({ container });

  //     getAllByLabelText('remove-access-strategy')[0].click();

  //     await waitForDomChange({ container });

  //     getByText('Save').click();
  //     expect(mutation).toHaveBeenCalledWith({
  //       variables: {
  //         name: apiRule().name,
  //         namespace: mockNamespace,
  //         params: {
  //           ...apiRule().spec,
  //           rules: [apiRule().spec.rules[1]],
  //         },
  //       },
  //     });
  //   });

  //   it('does not modify other strategies after removing one', async () => {
  //     const mutation = jest.fn();
  //     const rule = apiRule();
  //     const { getAllByLabelText, container } = render(
  //       <MockedProvider mocks={[servicesQuery]}>
  //         <ApiRuleForm
  //           apiRule={rule}
  //           mutation={mutation}
  //           saveButtonText="Save"
  //           headerTitle="Form"
  //           breadcrumbItems={[]}
  //         />
  //       </MockedProvider>,
  //     );
  //     await waitForDomChange({ container });

  //     getAllByLabelText('remove-access-strategy')[0].click();

  //     await waitForDomChange({ container });

  //     const strategySelects = getAllByLabelText('Access strategy type');
  //     const nonRemovedRule = rule.spec.rules[1].accessStrategies[0];
  //     expect(strategySelects[0].value).toBe(nonRemovedRule.name);
  //   });

  //   it('allows to modify exisitng access strategy', async () => {
  //     const mutation = jest.fn();
  //     const { getAllByLabelText, getByText, container } = render(
  //       <MockedProvider mocks={[servicesQuery]}>
  //         <ApiRuleForm
  //           apiRule={apiRule()}
  //           mutation={mutation}
  //           saveButtonText="Save"
  //           headerTitle="Form"
  //           breadcrumbItems={[]}
  //         />
  //       </MockedProvider>,
  //     );

  //     await waitForDomChange({ container });

  //     const paths = getAllByLabelText('Access strategy path');

  //     fireEvent.change(paths[0], {
  //       target: { value: '/path' },
  //     });

  //     getByText('Save').click();
  //     expect(mutation).toHaveBeenCalledWith({
  //       variables: {
  //         name: apiRule().name,
  //         namespace: mockNamespace,
  //         params: {
  //           ...apiRule().spec,
  //           rules: [
  //             {
  //               ...apiRule().spec.rules[0],
  //               path: '/path',
  //             },
  //             apiRule().spec.rules[1],
  //           ],
  //         },
  //       },
  //     });
  //   });

  //   it('disables form for non-allow rule without methods', async () => {
  //     const { getByText, getAllByLabelText, container } = render(
  //       <MockedProvider mocks={[servicesQuery]}>
  //         <ApiRuleForm
  //           apiRule={apiRule()}
  //           mutation={mutation}
  //           saveButtonText="Save"
  //           headerTitle="Form"
  //           breadcrumbItems={[]}
  //         />
  //       </MockedProvider>,
  //     );

  //     await waitForDomChange({ container });

  //     // uncheck methods
  //     apiRule().spec.rules[0].methods.forEach(method =>
  //       fireEvent.click(getAllByLabelText(method)[0]),
  //     );

  //     expect(getByText('Save')).toBeDisabled();
  //   });
});

// function verifyMethodCheckboxes(queryAllByLabelText, method) {
//   const checkboxes = queryAllByLabelText(method);
//   expect(checkboxes).toHaveLength(apiRule().spec.rules.length);
//   checkboxes.forEach((checkbox, idx) => {
//     if (apiRule().spec.rules[idx].methods.includes(method)) {
//       expect(checkbox).toBeChecked();
//     } else {
//       expect(checkbox).not.toBeChecked();
//     }
//   });
// }

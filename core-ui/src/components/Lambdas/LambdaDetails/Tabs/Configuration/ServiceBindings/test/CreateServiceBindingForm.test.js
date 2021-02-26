// import React from 'react';
// import renderer from 'react-test-renderer';
// import { mount } from 'enzyme';
// import { MockedProvider } from '@apollo/react-testing';

// import { componentUpdate } from 'testing';

// import CreateServiceBindingForm from '../CreateServiceBindingForm';

describe('CreateServiceBindingForm', () => {
  test.todo('CreateServiceBindingForm');
  // it('Renders with minimal props', () => {
  //   const component = renderer.create(
  //     <MockedProvider>
  //       <CreateServiceBindingForm formElementRef={{ current: null }} />
  //     </MockedProvider>,
  //   );

  //   expect(component).toBeTruthy();
  // });

  // const serviceInstance_1 = {
  //   name: 'serviceInstance_1',
  //   bindable: true,
  //   serviceBindings: {
  //     items: [
  //       {
  //         name: 'foo',
  //       },
  //     ],
  //   },
  // };
  // const serviceInstance_2 = {
  //   name: 'serviceInstance_2',
  //   bindable: true,
  // };
  // const serviceInstances = [serviceInstance_1, serviceInstance_2];

  // it('Shows empty Service Instance name select, predefined dropdowns and does not allow to submit form', () => {
  //   const component = mount(
  //     <MockedProvider>
  //       <CreateServiceBindingForm
  //         formElementRef={{ current: null }}
  //         serviceInstances={serviceInstances}
  //       />
  //     </MockedProvider>,
  //   );

  //   const serviceInstanceNameSelector = 'select#serviceInstanceName';
  //   const serviceInstanceNameSelect = component.find(
  //     serviceInstanceNameSelector,
  //   );
  //   expect(serviceInstanceNameSelect.exists()).toEqual(true);
  //   expect(serviceInstanceNameSelect.props().children.length).toEqual(2);

  //   const envPrefixSelector = 'input#envPrefix';
  //   const envPrefixInput = component.find(envPrefixSelector);
  //   expect(envPrefixInput.exists()).toEqual(true);
  //   expect(envPrefixInput.instance().value).toEqual('');

  //   expect(
  //     component
  //       .find('form')
  //       .instance()
  //       .checkValidity(),
  //   ).toEqual(false);
  // });

  // it('Allows to submit form with valid Service Instance select', () => {
  //   const component = mount(
  //     <MockedProvider>
  //       <CreateServiceBindingForm
  //         formElementRef={{ current: null }}
  //         serviceInstances={serviceInstances}
  //       />
  //     </MockedProvider>,
  //   );

  //   const serviceInstanceNameSelector = 'select#serviceInstanceName';
  //   const serviceInstanceNameSelect = component.find(
  //     serviceInstanceNameSelector,
  //   );
  //   serviceInstanceNameSelect.getDOMNode().value = 'serviceInstance_1';
  //   serviceInstanceNameSelect.simulate('change', {
  //     target: { value: 'serviceInstance_1' },
  //   });
  //   expect(serviceInstanceNameSelect.instance().value).toEqual(
  //     'serviceInstance_1',
  //   );

  //   expect(
  //     component
  //       .find('form')
  //       .instance()
  //       .checkValidity(),
  //   ).toEqual(true);
  // });

  // it('Creates Service Binding properly', async () => {
  //   const component = mount(
  //     <MockedProvider>
  //       <CreateServiceBindingForm
  //         formElementRef={{ current: null }}
  //         serviceInstances={serviceInstances}
  //       />
  //     </MockedProvider>,
  //   );

  //   const serviceInstanceNameSelector = 'select#serviceInstanceName';
  //   const serviceInstanceNameSelect = component.find(
  //     serviceInstanceNameSelector,
  //   );
  //   serviceInstanceNameSelect.getDOMNode().value = 'serviceInstance_1';
  //   serviceInstanceNameSelect.simulate('change', {
  //     target: { value: 'serviceInstance_1' },
  //   });

  //   const form = component.find('form');
  //   form.simulate('submit');

  //   await componentUpdate(component);
  // });

  // it('Uncheck createCredentials checkbox and check render of existingCredentials select - disable form submit', async () => {
  //   const refetchQuery = jest.fn();

  //   const component = mount(
  //     <MockedProvider>
  //       <CreateServiceBindingForm
  //         formElementRef={{ current: null }}
  //         serviceInstances={serviceInstances}
  //       />
  //     </MockedProvider>,
  //   );

  //   const serviceInstanceNameSelector = 'select#serviceInstanceName';
  //   const serviceInstanceNameSelect = component.find(
  //     serviceInstanceNameSelector,
  //   );
  //   serviceInstanceNameSelect.getDOMNode().value = 'serviceInstance_1';
  //   serviceInstanceNameSelect.simulate('change', {
  //     target: { value: 'serviceInstance_1' },
  //   });

  //   const createCredentialsSelector = 'input#createCredentials';
  //   const createCredentialsCheckbox = component.find(createCredentialsSelector);
  //   createCredentialsCheckbox.getDOMNode().checked = false;
  //   createCredentialsCheckbox.simulate('change', {
  //     target: { checked: false },
  //   });

  //   await componentUpdate(component);

  //   const existingCredentialsSelector = 'select#existingCredentials';
  //   const existingCredentialsSelect = component.find(
  //     existingCredentialsSelector,
  //   );
  //   expect(existingCredentialsSelect.exists()).toEqual(true);
  //   expect(existingCredentialsSelect.props().children.length).toEqual(2);

  //   expect(
  //     component
  //       .find('form')
  //       .instance()
  //       .checkValidity(),
  //   ).toEqual(false);
  // });

  // it('Uncheck createCredentials checkbox and check render of existingCredentials select - enable form submit', async () => {
  //   const component = mount(
  //     <MockedProvider>
  //       <CreateServiceBindingForm
  //         formElementRef={{ current: null }}
  //         serviceInstances={serviceInstances}
  //       />
  //     </MockedProvider>,
  //   );

  //   const serviceInstanceNameSelector = 'select#serviceInstanceName';
  //   const serviceInstanceNameSelect = component.find(
  //     serviceInstanceNameSelector,
  //   );
  //   serviceInstanceNameSelect.getDOMNode().value = 'serviceInstance_1';
  //   serviceInstanceNameSelect.simulate('change', {
  //     target: { value: 'serviceInstance_1' },
  //   });

  //   const createCredentialsSelector = 'input#createCredentials';
  //   const createCredentialsCheckbox = component.find(createCredentialsSelector);
  //   createCredentialsCheckbox.getDOMNode().checked = false;
  //   createCredentialsCheckbox.simulate('change', {
  //     target: { checked: false },
  //   });

  //   await componentUpdate(component);

  //   const existingCredentialsSelector = 'select#existingCredentials';
  //   const existingCredentialsSelect = component.find(
  //     existingCredentialsSelector,
  //   );
  //   existingCredentialsSelect.getDOMNode().value = 'foo';
  //   existingCredentialsSelect.simulate('change', { target: { value: 'foo' } });

  //   expect(
  //     component
  //       .find('form')
  //       .instance()
  //       .checkValidity(),
  //   ).toEqual(true);
  // });
});

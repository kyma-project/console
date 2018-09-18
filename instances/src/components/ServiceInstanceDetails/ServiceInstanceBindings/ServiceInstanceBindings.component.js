import React from 'react';

import { Table } from '@kyma-project/react-components';

import CreateBindingModal from './CreateBindingModal/CreateBindingModal.container';
import SecretDataModal from './SecretDataModal/SecretDataModal.component';
import DeleteBindingModal from './DeleteBindingModal/DeleteBindingModal.component';

import {
  ServiceInstanceBindingsWrapper,
  LinkButton,
  SecretModalButton,
} from './styled';

class ServiceInstanceBindings extends React.Component {
  capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  countBindingUsage = usage => {
    return this.props.serviceInstance.serviceBindingUsages.filter(item => {
      if (!item.serviceBinding || !usage.serviceBinding) {
        return false;
      }
      return item.serviceBinding.name === usage.serviceBinding.name;
    }).length;
  };

  render() {
    const {
      createBinding,
      createBindingUsage,
      deleteBinding,
      deleteBindingUsage,
      serviceInstance,
      serviceInstanceRefetch,
    } = this.props;

    const table = {
      title: 'Bindings',
      columns: [
        {
          name: 'Binding Usage',
          size: 0.25,
          accesor: el => <LinkButton>{el.name}</LinkButton>,
        },
        {
          name: 'Bound Resource',
          size: 0.25,
          accesor: el =>
            `${el.usedBy.name} (${this.capitalize(el.usedBy.kind)})`,
        },
        {
          name: 'Binding',
          size: 0.2,
          accesor: el => el.serviceBinding && el.serviceBinding.name,
        },
        {
          name: 'Secret',
          size: 0.2,
          accesor: el => {
            const secret = el.serviceBinding && el.serviceBinding.secret;
            return secret ? (
              <SecretDataModal
                title={`Secret "${secret.name}"`}
                data={secret.data}
                modalOpeningComponent={
                  <SecretModalButton>{secret.name}</SecretModalButton>
                }
              />
            ) : (
              '-'
            );
          },
        },
        {
          name: '',
          size: 0.1,
          accesor: el => (
            <DeleteBindingModal
              deleteBinding={deleteBinding}
              deleteBindingUsage={deleteBindingUsage}
              bindingName={
                (el.serviceBinding && el.serviceBinding.name) || null
              }
              bindingExists={Boolean(el.serviceBinding)}
              bindingUsageName={el.name}
              bindingUsageCount={this.countBindingUsage(el)}
              serviceInstanceRefetch={serviceInstanceRefetch}
            />
          ),
        },
      ],
      data: serviceInstance.serviceBindingUsages,
    };

    const createBindingContent = (
      <CreateBindingModal
        createBinding={createBinding}
        createBindingUsage={createBindingUsage}
        serviceInstance={serviceInstance}
        serviceInstanceRefetch={serviceInstanceRefetch}
      />
    );

    return (
      <ServiceInstanceBindingsWrapper>
        <Table
          title={table.title}
          addHeaderContent={createBindingContent}
          columns={table.columns}
          data={table.data}
          notFoundMessage="No Bindings found"
        />
      </ServiceInstanceBindingsWrapper>
    );
  }
}

export default ServiceInstanceBindings;

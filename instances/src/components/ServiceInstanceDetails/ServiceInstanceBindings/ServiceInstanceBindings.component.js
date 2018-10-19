import React, { Fragment } from 'react';

import {
  Icon,
  Table,
  Tabs,
  Tab,
  Tooltip,
} from '@kyma-project/react-components';

import BindApplicationModal from './BindApplicationModal/BindApplicationModal.container';
import CreateCredentialsModal from './CreateCredentialsModal/CreateCredentialsModal.container';
import SecretDataModal from './SecretDataModal/SecretDataModal.component';
import ParametersDataModal from './ParametersDataModal/ParametersDataModal.component';
import DeleteBindingModal from './DeleteBindingModal/DeleteBindingModal.component';
import StatusIndicator from './StatusIndicator/StatusIndicator.component';

import { statusColor } from '../../../commons/helpers';

import {
  ServiceInstanceBindingsWrapper,
  SecretModalButton,
  ParametersModalButton,
  ActionsWrapper,
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

  relatedBindingUsage = bindingName => {
    return this.props.serviceInstance.serviceBindingUsages.filter(item => {
      if (!item.serviceBinding) {
        return null;
      }
      return item.serviceBinding.name === bindingName;
    });
  };

  getStatusType = statusType => {
    let type;
    switch (statusType) {
      case 'READY':
        type = 'success';
        break;
      case 'FAILED':
        type = 'error';
        break;
      default:
        type = 'warning';
    }
    return type;
  };

  status = (data, id) => {
    return <StatusIndicator data={data} key={id} />;
  };

  render() {
    const {
      createBinding,
      createBindingUsage,
      deleteBinding,
      deleteBindingUsage,
      serviceInstanceRefetch,
      serviceInstance,
    } = this.props;

    const serviceBindingsUsageTable = {
      title: 'Bindings',
      columns: [
        {
          name: 'Service Binding Usage',
          size: 0.2,
          accesor: el => el.name,
        },
        {
          name: 'Bound Applications',
          size: 0.2,
          accesor: el =>
            `${el.usedBy.name} (${this.capitalize(el.usedBy.kind)})`,
        },
        {
          name: 'Service Binding',
          size: 0.2,
          accesor: el => el.serviceBinding && el.serviceBinding.name,
        },
        {
          name: 'Secret',
          size: 0.2,
          accesor: el => {
            const secret = el.serviceBinding && el.serviceBinding.secret;
            return secret && Object.keys(secret).length ? (
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
          name: 'Status',
          size: 0.1,
          accesor: el => (
            <Tooltip
              type={this.getStatusType(el.status.type)}
              content={el.status.message}
              minWidth="250px"
            >
              <span
                style={{
                  color: statusColor(el.status.type),
                  cursor: `${el.status.message ? 'help' : 'default'}`,
                }}
              >
                {el.status.type}
              </span>
            </Tooltip>
          ),
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
              id={`service-binding-delete-${el.name}`}
            />
          ),
        },
      ],
      data: serviceInstance.serviceBindingUsages,
    };

    const serviceBindingsTable = {
      title: 'Bindings',
      columns: [
        {
          name: 'Service Binding',
          size: 0.2,
          accesor: el => el.name,
        },
        {
          name: 'Secret',
          size: 0.45,
          accesor: el => {
            const secret = el && el.secret;
            return secret && Object.keys(secret).length ? (
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
          name: 'Status',
          size: 0.2,
          accesor: el => (
            <Tooltip
              type={this.getStatusType(el.status.type)}
              content={el.status.message}
              minWidth="250px"
            >
              <span
                style={{
                  color: statusColor(el.status.type),
                  cursor: `${el.status.message ? 'help' : 'default'}`,
                }}
              >
                {el.status.type}
              </span>
            </Tooltip>
          ),
        },
        {
          name: '',
          size: 0.15,
          accesor: el => {
            const parameters = el && el.parameters;
            return (
              <ActionsWrapper>
                {parameters &&
                  Object.keys(parameters).length > 0 && (
                    <ParametersDataModal
                      title={`Parameters "${el.name}"`}
                      data={parameters}
                      modalOpeningComponent={
                        <ParametersModalButton
                          id={`service-binding-parameters-${el.name}`}
                          margin={'0 8px'}
                        >
                          <Icon icon={'\uE139'} />
                        </ParametersModalButton>
                      }
                    />
                  )}

                <DeleteBindingModal
                  deleteBinding={deleteBinding}
                  bindingName={el.name || null}
                  bindingExists={Boolean(el)}
                  bindingUsageCount={this.countBindingUsage({
                    serviceBinding: el,
                  })}
                  relatedBindingUsage={this.relatedBindingUsage(el.name)}
                  serviceInstanceRefetch={serviceInstanceRefetch}
                  id={`service-binding-delete-${el.name}`}
                />
              </ActionsWrapper>
            );
          },
        },
      ],
      data: serviceInstance.serviceBindings.items,
    };

    const bindApplication = (
      <BindApplicationModal
        createBinding={createBinding}
        createBindingUsage={createBindingUsage}
        serviceInstance={serviceInstance}
        serviceInstanceRefetch={serviceInstanceRefetch}
        id={`create-service-binding`}
      />
    );

    const boundApplicationContent = (
      <Fragment>
        <ActionsWrapper>{bindApplication}</ActionsWrapper>
      </Fragment>
    );

    const createCredentials = (
      <CreateCredentialsModal
        createBinding={createBinding}
        createBindingUsage={createBindingUsage}
        serviceInstance={serviceInstance}
        serviceInstanceRefetch={serviceInstanceRefetch}
        id={`create-credentials`}
      />
    );
    const createCredentialsContent = (
      <Fragment>
        <ActionsWrapper>{createCredentials}</ActionsWrapper>
      </Fragment>
    );

    return (
      <ServiceInstanceBindingsWrapper>
        <Tabs>
          <Tab
            title={'Bound Applications'}
            id={'service-binding-usage-tab'}
            addHeaderContent={boundApplicationContent}
            additionalTitle={
              'ServiceBindingUsage is a Kyma custom resource that allows the ServiceBindingUsage controller to inject Secrets into a given application.'
            }
            tooltipMinWidth={'230px'}
            aditionalStatus={this.status(
              serviceBindingsUsageTable.data,
              'service-binding-usage-tab',
            )}
          >
            <Table
              columns={serviceBindingsUsageTable.columns}
              data={serviceBindingsUsageTable.data}
              notFoundMessage="No applications found"
              margin="-21px -20px -20px"
            />
          </Tab>
          <Tab
            title={'Credentials'}
            id={'service-binding-tab'}
            addHeaderContent={createCredentialsContent}
            additionalTitle={
              'ServiceBinding is a link between a ServiceInstance and an application that cluster users create to obtain access credentials for their applications.'
            }
            tooltipMinWidth={'230px'}
            aditionalStatus={this.status(
              serviceBindingsTable.data,
              'service-binding-tab',
            )}
          >
            <Table
              columns={serviceBindingsTable.columns}
              data={serviceBindingsTable.data}
              notFoundMessage="No credentials found"
              margin="-21px -20px -20px"
            />
          </Tab>
        </Tabs>
      </ServiceInstanceBindingsWrapper>
    );
  }
}

export default ServiceInstanceBindings;

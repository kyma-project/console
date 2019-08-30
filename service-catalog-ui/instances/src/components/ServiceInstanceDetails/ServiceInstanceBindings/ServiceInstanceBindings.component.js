import React, { Fragment } from 'react';

import {
  instanceStatusColor,
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

import {
  Bold,
  ServiceInstanceBindingsWrapper,
  SecretModalButton,
  ActionsWrapper,
} from './styled';

import { TextOverflowWrapper } from '../../ServiceInstances/ServiceInstancesTable/styled';

import { backendModuleExists } from '../../../commons/helpers';

class ServiceInstanceBindings extends React.Component {
  capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  countBindingUsage = usage => {
    if (
      !this.props.serviceInstance ||
      !this.props.serviceInstance.serviceBindingUsages
    ) {
      return 0;
    }

    return this.props.serviceInstance.serviceBindingUsages.filter(item => {
      if (!item.serviceBinding || !usage.serviceBinding) {
        return false;
      }
      return item.serviceBinding.name === usage.serviceBinding.name;
    }).length;
  };

  relatedBindingUsage = bindingName => {
    if (!this.props.serviceInstance.serviceBindingUsages) return null;

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
    return <StatusIndicator testId={id} data={data} key={id} />;
  };

  createBindingUsagesTableData = data => {
    if (!data.length) return [];

    return data.map((bindingUsage, index) => {
      return {
        rowData: [
          <TextOverflowWrapper>
            <span data-e2e-id="binding-name" title={bindingUsage.name}>
              {bindingUsage.name}
            </span>
          </TextOverflowWrapper>,
          (_ => {
            const text = `${bindingUsage.usedBy.name} (${this.capitalize(
              bindingUsage.usedBy.kind,
            )})`;

            return (
              <TextOverflowWrapper>
                <span title={text}>{text}</span>
              </TextOverflowWrapper>
            );
          })(),
          (_ => {
            return (
              bindingUsage.serviceBinding && (
                <TextOverflowWrapper>
                  <span title={bindingUsage.serviceBinding.name}>
                    {bindingUsage.serviceBinding.name}
                  </span>
                </TextOverflowWrapper>
              )
            );
          })(),
          (_ => {
            const prefix =
              bindingUsage.parameters &&
              bindingUsage.parameters.envPrefix &&
              bindingUsage.parameters.envPrefix.name;
            const secret =
              bindingUsage.serviceBinding && bindingUsage.serviceBinding.secret;

            return secret && Object.keys(secret).length ? (
              <TextOverflowWrapper>
                <SecretDataModal
                  title={
                    <span title={secret.name}>
                      Secret <Bold>{secret.name}</Bold>
                    </span>
                  }
                  modalOpeningComponent={
                    <SecretModalButton data-e2e-id="secret-button">
                      {secret.name}
                    </SecretModalButton>
                  }
                  data={secret.data}
                  prefix={prefix}
                />
              </TextOverflowWrapper>
            ) : (
              '-'
            );
          })(),
          <Tooltip
            type={this.getStatusType(bindingUsage.status.type)}
            content={bindingUsage.status.message}
            minWidth="250px"
          >
            <span
              style={{
                color: instanceStatusColor(bindingUsage.status.type),
                cursor: `${bindingUsage.status.message ? 'help' : 'default'}`,
              }}
              title={bindingUsage.status.type}
            >
              {bindingUsage.status.type}
            </span>
          </Tooltip>,
          <ActionsWrapper>
            <DeleteBindingModal
              deleteBindingUsage={this.props.deleteBindingUsage}
              bindingUsageName={bindingUsage.name}
              bindingUsageCount={this.countBindingUsage(bindingUsage)}
              id={`service-binding-delete-${bindingUsage.name}`}
            />
          </ActionsWrapper>,
        ],
      };
    });
  };

  createBindingsTableData = data => {
    if (!data.length) return [];

    return data.map((binding, index) => {
      return {
        rowData: [
          <TextOverflowWrapper>
            <span data-e2e-id="credential-name" title={binding.name}>
              {binding.name}
            </span>
          </TextOverflowWrapper>,
          (_ => {
            const secret = binding && binding.secret;
            return secret && Object.keys(secret).length ? (
              <TextOverflowWrapper>
                <SecretDataModal
                  title={
                    <span title={secret.name}>
                      Secret <Bold>{secret.name}</Bold>
                    </span>
                  }
                  modalOpeningComponent={
                    <SecretModalButton data-e2e-id="secret-button">
                      {secret.name}
                    </SecretModalButton>
                  }
                  data={secret.data}
                />
              </TextOverflowWrapper>
            ) : (
              '-'
            );
          })(),
          <Tooltip
            type={this.getStatusType(binding.status.type)}
            content={binding.status.message}
            minWidth="250px"
            wrapperStyles="max-width: 100%;"
          >
            <span
              style={{
                color: instanceStatusColor(binding.status.type),
                cursor: `${binding.status.message ? 'help' : 'default'}`,
              }}
              title={binding.status.type}
            >
              {binding.status.type}
            </span>
          </Tooltip>,
          (_ => {
            const parameters = binding && binding.parameters;
            return (
              <ActionsWrapper>
                {parameters && Object.keys(parameters).length > 0 && (
                  <Tooltip content={'Parameters'} minWidth="90px">
                    <span
                      style={{
                        cursor: 'help',
                      }}
                    >
                      <ParametersDataModal
                        title={
                          <Fragment>
                            Parameters for <Bold>{binding.name}</Bold>
                          </Fragment>
                        }
                        data={parameters}
                      />
                    </span>
                  </Tooltip>
                )}

                <DeleteBindingModal
                  deleteBinding={this.props.deleteBinding}
                  bindingName={binding.name || null}
                  bindingExists={Boolean(binding)}
                  bindingUsageCount={this.countBindingUsage({
                    serviceBinding: binding,
                  })}
                  relatedBindingUsage={this.relatedBindingUsage(binding.name)}
                  id={`service-binding-delete-${binding.name}`}
                />
              </ActionsWrapper>
            );
          })(),
        ],
      };
    });
  };

  render() {
    const {
      createBinding,
      createBindingUsage,
      serviceInstance,
      callback,
    } = this.props;

    const bindable = serviceInstance.bindable;
    if (!bindable) {
      return null;
    }

    const bindApplication = (
      <BindApplicationModal
        createBinding={createBinding}
        createBindingUsage={createBindingUsage}
        serviceInstance={serviceInstance}
        id={`create-service-binding`}
      />
    );

    const boundApplicationContent = (
      <>
        <ActionsWrapper>{bindApplication}</ActionsWrapper>
      </>
    );

    const createCredentials = (
      <CreateCredentialsModal
        createBinding={createBinding}
        createBindingUsage={createBindingUsage}
        serviceInstance={serviceInstance}
        id={`create-credentials`}
      />
    );
    const createCredentialsContent = (
      <>
        <ActionsWrapper>{createCredentials}</ActionsWrapper>
      </>
    );

    const serviceCatalogAddonsBackendModuleExists = backendModuleExists(
      'servicecatalogaddons',
    );

    const bindingUsagesHeaders = [
      'Service Binding Usage',
      'Bound Applications',
      'Service Binding',
      'Secret',
      'Status',
      '',
    ];
    let bindingUsagesTableData = null;
    if (serviceCatalogAddonsBackendModuleExists) {
      bindingUsagesTableData = this.createBindingUsagesTableData(
        serviceInstance.serviceBindingUsages,
      );
    }

    const bindingsHeaders = ['Bindings', 'Secret', 'Status', ''];
    const bindingsTableData = this.createBindingsTableData(
      serviceInstance.serviceBindings.items,
    );

    return (
      <ServiceInstanceBindingsWrapper>
        <Tabs
          defaultActiveTabIndex={this.props.defaultActiveTabIndex}
          callback={callback}
        >
          {serviceCatalogAddonsBackendModuleExists ? (
            <Tab
              title={
                <Tooltip
                  content="ServiceBindingUsage is a Kyma custom resource that allows the ServiceBindingUsage controller to inject Secrets into a given application."
                  minWidth="210px"
                  showTooltipTimeout={750}
                  key="service-binding-usage-tooltip"
                >
                  <span data-e2e-id="service-binding-usage-tab">
                    Bound Applications
                  </span>
                </Tooltip>
              }
              addHeaderContent={boundApplicationContent}
              status={this.status(
                serviceInstance.serviceBindingUsages,
                'status-service-binding-usage',
              )}
              noMargin
            >
              <Table
                headers={bindingUsagesHeaders}
                tableData={bindingUsagesTableData}
                notFoundMessage="No applications found"
              />
            </Tab>
          ) : null}
          <Tab
            title={
              <Tooltip
                content="ServiceBinding is a link between a ServiceInstance and an application that cluster users create to obtain access credentials for their applications."
                minWidth="210px"
                showTooltipTimeout={750}
                key="service-binding-tooltip"
              >
                <span data-e2e-id="service-binding-tab">Credentials</span>
              </Tooltip>
            }
            addHeaderContent={createCredentialsContent}
            status={this.status(
              serviceInstance.serviceBindings.items,
              'status-service-binding',
            )}
            noMargin
          >
            <Table
              headers={bindingsHeaders}
              tableData={bindingsTableData}
              notFoundMessage="No credentials found"
            />
          </Tab>
        </Tabs>
      </ServiceInstanceBindingsWrapper>
    );
  }
}

export default ServiceInstanceBindings;

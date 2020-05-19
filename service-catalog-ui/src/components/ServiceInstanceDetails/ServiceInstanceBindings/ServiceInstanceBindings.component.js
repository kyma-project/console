import React from 'react';

import {
  instanceStatusColor,
  Tooltip as StatusTooltip,
} from '@kyma-project/react-components';
import { Tabs, Tab, Tooltip, GenericList } from 'react-shared';
import BindApplicationModal from './BindApplicationModal/BindApplicationModal.container';
import CreateCredentialsModal from './CreateCredentialsModal/CreateCredentialsModal.component';
import SecretDataModal from './SecretDataModal/SecretDataModal.component';
import ParametersDataModal from './ParametersDataModal/ParametersDataModal.component';
import DeleteBindingModal from './DeleteBindingModal/DeleteBindingModal.component';
import StatusIndicator from './StatusIndicator/StatusIndicator.component';

import {
  ServiceInstanceBindingsWrapper,
  SecretModalButton,
  ActionsWrapper,
} from './styled';

import { TextOverflowWrapper } from '../../ServiceInstanceList/ServiceInstanceTable/styled';

import { backendModuleExists } from 'helpers';

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

  render() {
    const { createBinding, createBindingUsage, serviceInstance } = this.props;

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

    const bindingUsagesHeaderRenderer = () => [
      'Service Binding Usage',
      'Bound Applications',
      'Service Binding',
      'Secret',
      'Status',
      '',
    ];
    const bindingUsagesRowRenderer = bindingUsage => [
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
              title={`Secret ${secret.name}`}
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
      <StatusTooltip
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
      </StatusTooltip>,
      <div class="list-actions">
        <DeleteBindingModal
          deleteBindingUsage={this.props.deleteBindingUsage}
          bindingUsageName={bindingUsage.name}
          bindingUsageCount={this.countBindingUsage(bindingUsage)}
          id={`service-binding-delete-${bindingUsage.name}`}
        />
      </div>,
    ];

    const bindingsHeaderRenderer = () => ['Bindings', 'Secret', 'Status', ''];
    const bindingsRowRenderer = binding => [
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
              title={`Secret ${secret.name}`}
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
      <StatusTooltip
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
      </StatusTooltip>,
      (_ => {
        const parameters = binding && binding.parameters;
        return (
          <div class="list-actions">
            {parameters && Object.keys(parameters).length > 0 && (
              <Tooltip title={'Parameters'}>
                <span
                  style={{
                    cursor: 'help',
                  }}
                >
                  <ParametersDataModal
                    title={`Parameters for ${binding.name}`}
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
          </div>
        );
      })(),
    ];

    return (
      <ServiceInstanceBindingsWrapper>
        <Tabs
          customClass={'table-styles'}
          defaultActiveTabIndex={this.props.defaultActiveTabIndex}
        >
          {serviceCatalogAddonsBackendModuleExists ? (
            <Tab
              title={
                <Tooltip title="ServiceBindingUsage is a Kyma custom resource that allows the ServiceBindingUsage controller to inject Secrets into a given application.">
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
            >
              <GenericList
                key="binding-usages-list"
                headerRenderer={bindingUsagesHeaderRenderer}
                entries={serviceInstance.serviceBindingUsages}
                rowRenderer={bindingUsagesRowRenderer}
                notFoundMessage="No applications found"
                showRootHeader={false}
                hasExternalMargin={false}
              />
            </Tab>
          ) : null}
          <Tab
            title={
              <Tooltip title="ServiceBinding is a link between a ServiceInstance and an application that cluster users create to obtain access credentials for their applications.">
                <span data-e2e-id="service-binding-tab">Credentials</span>
              </Tooltip>
            }
            addHeaderContent={createCredentialsContent}
            status={this.status(
              serviceInstance.serviceBindings.items,
              'status-service-binding',
            )}
          >
            <GenericList
              key="bindings-list"
              headerRenderer={bindingsHeaderRenderer}
              entries={serviceInstance.serviceBindings.items}
              rowRenderer={bindingsRowRenderer}
              notFoundMessage="No credentials found"
              showRootHeader={false}
              hasExternalMargin={false}
            />
          </Tab>
        </Tabs>
      </ServiceInstanceBindingsWrapper>
    );
  }
}

export default ServiceInstanceBindings;

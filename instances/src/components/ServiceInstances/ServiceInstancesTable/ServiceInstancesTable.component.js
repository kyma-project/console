import React, { Component } from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import { Button, Table, Tooltip, Modal } from '@kyma-project/react-components';

import {
  LinkButton,
  Link,
  ServiceClassButton,
  ServicePlanButton,
  JSONCode,
  TextOverflowWrapper,
} from './styled';

import {
  getResourceDisplayName,
  statusColor,
  backendModuleExists,
} from '../../../commons/helpers';

const deleteButton = <Button compact option="light" glyph="delete" />;

export class ServiceInstancesTable extends Component {
  displayBindingsUsages = (bindings = []) => {
    if (!bindings) return null;

    switch (bindings.length) {
      case 0:
        return '-';
      case 1:
        return `${bindings[0].usedBy.name} (${this.capitalize(
          bindings[0].usedBy.kind,
        )})`;
      default:
        return `Multiple (${bindings.length})`;
    }
  };

  capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  goToServiceCatalog = () => {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate('cmf-service-catalog');
  };

  goToServiceClassDetails = name => {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`cmf-service-catalog/details/${name}`);
  };

  goToServiceInstanceDetails = name => {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`cmf-instances/details/${name}`);
  };

  render() {
    const { data, deleteServiceInstance, loading } = this.props;
    const handleDelete = async element => {
      await deleteServiceInstance(element.name);
    };

    const serviceCatalogAddonsBackendModuleExists = backendModuleExists(
      'servicecatalogaddons',
    );

    const createTableData = () => {
      return data.map(instance => {
        return {
          rowData: [
            <TextOverflowWrapper>
              <LinkButton data-e2e-id="instance-name">
                <Link
                  onClick={() => this.goToServiceInstanceDetails(instance.name)}
                  data-e2e-id={`instance-name-${instance.name}`}
                  title={instance.name}
                >
                  {instance.name}
                </Link>
              </LinkButton>
            </TextOverflowWrapper>,
            (_ => {
              const instanceClass =
                instance.clusterServiceClass || instance.serviceClass;
              if (!instanceClass || !instanceClass.name) {
                return '-';
              }

              const classTitle = getResourceDisplayName(instanceClass);
              return (
                <TextOverflowWrapper>
                  <ServiceClassButton
                    onClick={() =>
                      this.goToServiceClassDetails(instanceClass.name)
                    }
                    title={classTitle}
                  >
                    {classTitle}
                  </ServiceClassButton>
                </TextOverflowWrapper>
              );
            })(),
            (_ => {
              const plan = instance.clusterServicePlan || instance.servicePlan;
              if (!plan) {
                return '-';
              }

              const planDisplayName = getResourceDisplayName(plan);

              if (
                instance.planSpec &&
                instance.planSpec !== null &&
                typeof instance.planSpec === 'object' &&
                Object.keys(instance.planSpec).length
              ) {
                return (
                  <TextOverflowWrapper>
                    <Modal
                      title="Instance's Parameters"
                      modalOpeningComponent={
                        <ServicePlanButton data-e2e-id="service-plan">
                          {planDisplayName}
                        </ServicePlanButton>
                      }
                      onShow={() => LuigiClient.uxManager().addBackdrop()}
                      onHide={() => LuigiClient.uxManager().removeBackdrop()}
                    >
                      <JSONCode data-e2e-id="service-plan-content">
                        {JSON.stringify(instance.planSpec, null, 2)}
                      </JSONCode>
                    </Modal>
                  </TextOverflowWrapper>
                );
              }
              return (
                <TextOverflowWrapper>
                  <span>{planDisplayName}</span>
                </TextOverflowWrapper>
              );
            })(),
            (_ => {
              const bindingUsages = this.displayBindingsUsages(
                instance.serviceBindingUsages,
              );

              return (
                <TextOverflowWrapper>
                  <span>{bindingUsages}</span>
                </TextOverflowWrapper>
              );
            })(),
            (_ => {
              if (!instance.status) {
                return '-';
              }

              let type = '';
              switch (instance.status.type) {
                case 'RUNNING':
                  type = 'success';
                  break;
                case 'FAILED':
                  type = 'error';
                  break;
                default:
                  type = 'warning';
              }
              return (
                <Tooltip
                  wrapperStyles="max-width: 100%;"
                  type={type}
                  content={instance.status.message}
                  minWidth="250px"
                >
                  <span
                    style={{
                      color: statusColor(instance.status.type),
                      cursor: 'help',
                    }}
                  >
                    {instance.status.type}
                  </span>
                </Tooltip>
              );
            })(),
            <Modal
              title="Warning"
              content={`Are you sure you want to delete instance "${
                instance.name
              }"?`}
              confirmText="Delete"
              onConfirm={() => handleDelete(instance)}
              modalOpeningComponent={deleteButton}
              type="negative"
              onShow={() => LuigiClient.uxManager().addBackdrop()}
              onHide={() => LuigiClient.uxManager().removeBackdrop()}
            >
              {`Are you sure you want to delete instance "${instance.name}"?`}
            </Modal>,
          ],
        };
      });
    };

    const addServiceInstanceRedirectButton = (
      <Button
        compact
        option="light"
        onClick={this.goToServiceCatalog}
        data-e2e-id="add-instance"
      >
        + Add Instance
      </Button>
    );

    const title = 'Manage Service Instances';
    const tableData = createTableData();

    let headers = [
      'Name',
      'Service Class',
      'Plan',
      'Bound Applications',
      'Status',
      '',
    ];

    if (!serviceCatalogAddonsBackendModuleExists) {
      headers.splice(3, 1);
      tableData.map(row => {
        row.rowData.splice(3, 1);
        return row;
      });
    }

    return (
      <Table
        title={title}
        addHeaderContent={addServiceInstanceRedirectButton}
        headers={headers}
        tableData={tableData}
        loadingData={loading}
        notFoundMessage="No Service Instances found"
      />
    );
  }
}

export default ServiceInstancesTable;

import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import {
  Button,
  Icon,
  ConfirmationModal,
  Table,
  Tooltip,
  InformationModal,
} from '@kyma-project/react-components';

import {
  LinkButton,
  Link,
  ServiceClassButton,
  AddServiceInstanceRedirectButton,
  ServicePlanButton,
  JSONCode,
} from './styled';

import { getResourceDisplayName, statusColor } from '../../../commons/helpers';

function ServiceInstancesTable({
  data,
  deleteServiceInstance,
  refetch,
  loading,
}) {
  const handleDelete = async element => {
    await deleteServiceInstance(element.name);
    setTimeout(() => {
      if (typeof refetch === 'function') {
        // Improve that
        refetch();
      }
    }, 1000);
  };

  const displayBindingsUsages = (bindings = []) => {
    switch (bindings.length) {
      case 0:
        return '-';
      case 1:
        return bindings[0].name;
      default:
        return `Multiple (${bindings.length})`;
    }
  };

  const goToServiceCatalog = () => {
    LuigiClient.linkManager()
      .fromContext('environment')
      .navigate('service-catalog');
  };

  const goToServiceClassDetails = name => {
    LuigiClient.linkManager()
      .fromContext('environment')
      .navigate(`service-catalog/details/${name}`);
  };

  const goToServiceInstanceDetails = name => {
    LuigiClient.linkManager()
      .fromContext('environment')
      .navigate(`instances/details/${name}`);
  };

  const deleteButton = (
    <div style={{ textAlign: 'right' }}>
      <Button padding={'0'} marginTop={'0'} marginBottom={'0'}>
        <Icon icon={'\uE03D'} />
      </Button>
    </div>
  );

  const addServiceInstanceRedirectButton = (
    <AddServiceInstanceRedirectButton onClick={goToServiceCatalog}>
      + Add Instance
    </AddServiceInstanceRedirectButton>
  );

  const table = {
    title: 'Manage Service Instances',
    columns: [
      {
        name: 'Name',
        size: 0.2,
        accesor: el => (
          <LinkButton data-e2e-id="instance-name">
            <Link
              onClick={() => goToServiceInstanceDetails(el.name)}
              data-e2e-id={`instance-name-${el.name}`}
            >
              {el.name}
            </Link>
          </LinkButton>
        ),
      },
      {
        name: 'Service Class',
        size: 0.2,
        accesor: el => {
          const elClass = el.clusterServiceClass || el.serviceClass;
          return elClass.name ? (
            <ServiceClassButton
              onClick={() => goToServiceClassDetails(elClass.name)}
            >
              {getResourceDisplayName(elClass)}
            </ServiceClassButton>
          ) : (
            '-'
          );
        },
      },
      {
        name: 'Plan',
        size: 0.2,
        accesor: el => {
          const plan = el.clusterServicePlan || el.servicePlan;
          if (
            el.planSpec &&
            el.planSpec !== null &&
            typeof el.planSpec === 'object' &&
            Object.keys(el.planSpec).length
          ) {
            return (
              <InformationModal
                title="Instances Parameters"
                modalOpeningComponent={
                  <ServicePlanButton>
                    {getResourceDisplayName(plan)}
                  </ServicePlanButton>
                }
                content={
                  <JSONCode>{JSON.stringify(el.planSpec, null, 2)}</JSONCode>
                }
              />
            );
          }
          return getResourceDisplayName(plan);
        },
      },
      {
        name: 'Bound Applications',
        size: 0.2,
        accesor: el => displayBindingsUsages(el.serviceBindingUsages),
      },
      {
        name: 'Status',
        size: 0.1,
        accesor: el => {
          let type = '';

          switch (el.status.type) {
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
            <Tooltip type={type} content={el.status.message} minWidth="250px">
              <span
                style={{ color: statusColor(el.status.type), cursor: 'help' }}
              >
                {el.status.type}
              </span>
            </Tooltip>
          );
        },
      },
      {
        name: '',
        size: 0.1,
        accesor: el => (
          <ConfirmationModal
            title="Warning"
            content={`Are you sure you want to delete instance "${el.name}"?`}
            confirmText="Delete"
            cancelText="Cancel"
            handleConfirmation={() => handleDelete(el)}
            modalOpeningComponent={deleteButton}
            warning={true}
            width={'481px'}
          />
        ),
      },
    ],
    data: data,
  };

  return (
    <Table
      title={table.title}
      addHeaderContent={addServiceInstanceRedirectButton}
      columns={table.columns}
      data={table.data}
      loading={loading}
      notFoundMessage="No Service Instances found"
    />
  );
}

export default ServiceInstancesTable;

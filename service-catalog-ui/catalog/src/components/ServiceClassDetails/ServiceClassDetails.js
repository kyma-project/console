import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import { getServiceClass } from './queries';

import {
  serviceClassConstants,
  createInstanceButtonText,
  filterExtensions,
} from '../../variables';

import ServiceClassTabs from './ServiceClassTabs/ServiceClassTabs';
import CreateInstanceModal from './CreateInstanceModal/CreateInstanceModal.container';
import { Identifier } from 'fundamental-react';
import ModalWithForm from '../../shared/ModalWithForm/ModalWithForm';
import { isStringValueEqualToTrue } from '../../commons/helpers';
import './ServiceClassDetails.scss';
import { ServiceClassDetailsWrapper, EmptyList } from './styled';
import LuigiClient from '@kyma-project/luigi-client';
import {
  getResourceDisplayName,
  getDescription,
  backendModuleExists,
} from '../../commons/helpers';
import ServiceClassDetailsHeader from './ServiceClassDetailsHeader/ServiceClassDetailsHeader.component';
import {
  DOCUMENTATION_PER_PLAN_LABEL,
  DOCUMENTATION_PER_PLAN_DESCRIPTION,
} from '../../shared/constants';
import { Tooltip, Spinner } from '../../react-shared';
import { Button } from 'fundamental-react';

export default function ServiceClassDetails({ name, plan }) {
  const namespace = LuigiClient.getEventData().environmentId;

  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(getServiceClass, {
    variables: {
      namespace,
      name,
      fileExtensions: filterExtensions,
    },
    fetchPolicy: 'no-cache',
  });

  if (queryLoading) {
    return (
      <EmptyList>
        <Spinner />
      </EmptyList>
    );
  }

  if (queryError) {
    return (
      <EmptyList>{serviceClassConstants.errorServiceClassDetails}</EmptyList>
    );
  }

  const serviceClass = queryData.clusterServiceClass || queryData.serviceClass;

  if (!serviceClass) {
    return <EmptyList>{serviceClassConstants.noClassText}</EmptyList>;
  }

  const serviceClassDisplayName = getResourceDisplayName(serviceClass);

  const serviceClassDescription = getDescription(serviceClass);

  const isProvisionedOnlyOnce =
    serviceClass.labels &&
    serviceClass.labels.provisionOnlyOnce &&
    isStringValueEqualToTrue(serviceClass.labels.provisionOnlyOnce);

  const buttonText = isProvisionedOnlyOnce
    ? serviceClass.activated
      ? createInstanceButtonText.provisionOnlyOnceActive
      : createInstanceButtonText.provisionOnlyOnce
    : createInstanceButtonText.standard;

  const {
    providerDisplayName,
    creationTimestamp,
    documentationUrl,
    supportUrl,
    imageUrl,
    tags,
    labels,
    plans,
  } = serviceClass;

  const isAPIpackage = labels[DOCUMENTATION_PER_PLAN_LABEL] === 'true';
  const currentPlan = isAPIpackage
    ? plans.find(p => p.name === plan)
    : undefined;

  if (isAPIpackage && !currentPlan) {
    //TODO: redrection to the plan selection view?
    LuigiClient.uxManager().showAlert({
      type: 'error',
      text:
        'The provided plan name is wrong. Please make sure you selected the right one.',
    });

    return (
      <section className="fd-section">
        <Button
          glyph="nav-back"
          onClick={() =>
            LuigiClient.linkManager()
              .fromClosestContext()
              .navigate('/')
          }
        >
          Go back to the Catalog
        </Button>
      </section>
    );
  }

  return (
    <>
      <ServiceClassDetailsHeader
        serviceClassDisplayName={serviceClassDisplayName}
        providerDisplayName={providerDisplayName}
        creationTimestamp={creationTimestamp}
        documentationUrl={documentationUrl}
        supportUrl={supportUrl}
        imageUrl={imageUrl}
        tags={tags}
        labels={labels}
        description={serviceClassDescription}
        isProvisionedOnlyOnce={isProvisionedOnlyOnce}
      >
        {isAPIpackage && (
          <Tooltip title={DOCUMENTATION_PER_PLAN_DESCRIPTION}>
            <Identifier
              id="docs-per-plan-icon"
              glyph="sap-box"
              label="docs-per-plan-icon"
              size="s"
            />
          </Tooltip>
        )}

        <ModalWithForm
          title={`Provision the ${serviceClass.displayName}${' '}
                    ${
                      serviceClass.__typename === 'ClusterServiceClass'
                        ? 'Cluster Service Class'
                        : 'Service Class'
                    }${' '}
                    in the ${namespace} Namespace`}
          button={{
            text: buttonText,
            glyph: 'add',
            disabled: Boolean(isProvisionedOnlyOnce && serviceClass.activated),
          }}
          id="add-instance-modal"
          item={serviceClass}
          renderForm={props => (
            <CreateInstanceModal {...props} preselectedPlan={currentPlan} />
          )}
        />
      </ServiceClassDetailsHeader>

      <ServiceClassDetailsWrapper phoneRows>
        {backendModuleExists('rafter') && (
          <ServiceClassTabs serviceClass={serviceClass} />
        )}
      </ServiceClassDetailsWrapper>
    </>
  );
}

import React, { useState, useEffect } from 'react';

import { useQuery } from '@apollo/react-hooks';
import { getServiceClass } from './queries';
import PropTypes from 'prop-types';
import {
  serviceClassConstants,
  createInstanceButtonText,
  filterExtensions,
} from '../../variables';

import ServiceClassTabs from './ServiceClassTabs/ServiceClassTabs';
import CreateInstanceModal from './CreateInstanceModal/CreateInstanceModal.container';
import { Identifier, Button } from 'fundamental-react';
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
import { sortByDisplayName } from '../../shared/sorting';

export const PlanSelector = ({ allPlans, currentlySelected, onPlanChange }) => {
  return (
    <select
      defaultValue={currentlySelected && currentlySelected.name}
      onChange={onPlanChange}
      aria-label="plan-selector"
    >
      {allPlans.map(p => (
        <option value={p.name} key={p.name}>
          {p.displayName}
        </option>
      ))}
    </select>
  );
};

PlanSelector.propTypes = {
  allPlans: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentlySelected: PropTypes.object,
  onPlanChange: PropTypes.func.isRequired,
};

export default function ServiceClassDetails({ name, plan }) {
  const namespace = LuigiClient.getEventData().environmentId;
  const [currentPlan, setCurrentPlan] = useState(null);

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

  useEffect(() => {
    if (!currentPlan || currentPlan.name === plan) return;

    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate(`/details/${name}/plan/${currentPlan.name}`, '', false);
  }, [currentPlan, name, plan]);

  if (queryLoading)
    return (
      <EmptyList>
        <Spinner />
      </EmptyList>
    );

  if (queryError)
    return (
      <EmptyList>{serviceClassConstants.errorServiceClassDetails}</EmptyList>
    );

  const serviceClass = queryData.clusterServiceClass || queryData.serviceClass;

  if (!serviceClass)
    return <EmptyList>{serviceClassConstants.noClassText}</EmptyList>;

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

  function handlePlanChange(e) {
    setCurrentPlan(plans.find(p => p.name === e.target.value));
  }

  const isAPIpackage =
    labels && labels[DOCUMENTATION_PER_PLAN_LABEL] === 'true';
  if (isAPIpackage && !currentPlan) {
    const planToSet = plans.find(p => p.name === plan);
    if (planToSet) setCurrentPlan(planToSet);
    else {
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
        isAPIpackage={isAPIpackage}
        planSelector={
          isAPIpackage && (
            <PlanSelector
              allPlans={plans.sort(sortByDisplayName)}
              currentlySelected={currentPlan}
              onPlanChange={handlePlanChange}
            />
          )
        }
        serviceClassName={name}
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
          <ServiceClassTabs
            serviceClass={serviceClass}
            currentPlan={isAPIpackage ? currentPlan : undefined}
          />
        )}
      </ServiceClassDetailsWrapper>
    </>
  );
}

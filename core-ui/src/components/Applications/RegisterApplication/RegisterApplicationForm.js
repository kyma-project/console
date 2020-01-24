import React, { useContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FormItem, FormLabel, InlineHelp } from 'fundamental-react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CompassGqlContext } from 'index';
import { REGISTER_APPLICATION } from '../../../gql/mutations';
import { CHECK_APPLICATION_EXISTS } from '../../../gql/queries';

const DEFAULT_SCENARIO_LABEL = 'DEFAULT';

RegisterApplicationForm.propTypes = {
  onChange: PropTypes.func,
  onCompleted: PropTypes.func,
  onError: PropTypes.func,
  formElementRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  performManualSubmit: PropTypes.func,
};

export default function RegisterApplicationForm({
  onChange,
  onCompleted,
  onError,
  formElementRef,
  performManualSubmit,
}) {
  const compassGqlClient = useContext(CompassGqlContext);
  const [registerApplication] = useMutation(REGISTER_APPLICATION, {
    client: compassGqlClient,
  });
  const {
    data: checkApplicationExistQueryResult,
    refetch: refetchCheckApplicationExistQuery,
  } = useQuery(CHECK_APPLICATION_EXISTS, {
    fetchPolicy: 'cache-and-network',
    client: compassGqlClient,
  });

  const formValues = {
    name: useRef(null),
    providerName: useRef(null),
    description: useRef(null),
  };

  useEffect(() => {
    const element = formValues.name.current;
    setImmediate(() => {
      if (element && typeof element.focus === 'function') element.focus();
    });
  }, [formValues.name]);

  const applicationAlreadyExists = name => {
    return checkApplicationExistQueryResult.applications.data
      .map(app => app.name)
      .includes(name);
  };

  const onFormChange = formEvent => {
    refetchCheckApplicationExistQuery();
    formValues.name.current.setCustomValidity(
      applicationAlreadyExists(formValues.name.current.value)
        ? 'Application with this name already exists.'
        : '',
    );
    onChange(formEvent);
  };

  async function handleFormSubmit(e) {
    try {
      const variables = {
        name: formValues.name.current.value,
        providerName: formValues.providerName.current.value,
        description: formValues.description.current.value,
        labels: {
          scenarios: [DEFAULT_SCENARIO_LABEL],
        },
      };
      await registerApplication({
        variables: { in: variables },
      });
      onCompleted(variables.name, `Application created succesfully`);
    } catch (e) {
      onError(
        `The application could not be created succesfully`,
        e.message || ``,
      );
    }
  }

  return (
    <form
      ref={formElementRef}
      style={{ width: '30em' }}
      onChange={onFormChange}
      onSubmit={handleFormSubmit}
    >
      <FormItem>
        <FormLabel required htmlFor="applicationName">
          Name
          <InlineHelp
            placement="bottom-right"
            text={`
              The name must consist of lower case alphanumeric characters or dashes, 
              and must start and end with an alphabetic character (e.g. 'my-k8s-name').
              The maximum length of the name is 36 characters.
              `}
          />
        </FormLabel>
        <input
          className="fd-form__control"
          ref={formValues.name}
          type="text"
          id="applicationName"
          placeholder="Name of the application"
          maxLength={36}
          aria-required="true"
          required
          pattern="^[a-z]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z])?)*$"
          onKeyDown={e => {
            if (e.keyCode === 13) {
              performManualSubmit();
            }
          }}
        />
      </FormItem>

      <FormItem>
        <FormLabel htmlFor="providerName">
          Provider Name
          <InlineHelp
            placement="bottom-right"
            text={'The maximum length of the provider name is 256 characters.'}
          />
        </FormLabel>
        <input
          ref={formValues.providerName}
          className="fd-form__control"
          label="Provider Name"
          placeholder="Name of the application provider"
          maxLength={256}
          id="providerName"
          type="text"
        />
      </FormItem>

      <FormItem>
        <FormLabel htmlFor="description">Description</FormLabel>
        <input
          ref={formValues.description}
          className="fd-form__control"
          label="Description"
          placeholder="Description of the Application"
          id="description"
          type="text"
        />
      </FormItem>

      {/* <FormItem>
        <FormLabel htmlFor="scenarios">Scenarios</FormLabel>
        <MultiChoiceList
          placeholder="Choose scenarios..."
          notSelectedMessage=""
          currentlySelectedItems={selectedScenarios}
          updateItems={updateSelectedScenarios}
          currentlyNonSelectedItems={
            availableScenarios
          }
          noEntitiesAvailableMessage="No more scenarios available"
        />
      </FormItem> */}
    </form>
  );
}

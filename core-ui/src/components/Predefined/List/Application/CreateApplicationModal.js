import React from 'react';
import { Button, FormSet } from 'fundamental-react';
import {
  ModalWithForm,
  TextFormItem,
  LabelSelectorInput,
  usePost,
} from 'react-shared';

export function createApplicationInput({ name, description, labels }) {
  return {
    apiVersion: 'applicationconnector.kyma-project.io/v1alpha1',
    kind: 'Application',
    metadata: {
      name,
    },
    spec: {
      accessLabel: name,
      description,
      labels,
      services: [],
    },
  };
}

export function CreateApplicationForm({
  formElementRef,
  onChange,
  onCompleted,
  onError,
}) {
  // https://github.com/kubernetes/kubernetes/blob/v1.10.1/staging/src/k8s.io/apimachinery/pkg/util/validation/validation.go
  const applicationNameRegex =
    '^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$';

  const [application, setApplication] = React.useState({});

  const postRequest = usePost();

  async function handleFormSubmit() {
    try {
      const applicationInput = createApplicationInput(application);
      await postRequest(
        '/apis/applicationconnector.kyma-project.io/v1alpha1/applications',
        applicationInput,
      );
      onCompleted(application.name, `Application created succesfully`);
    } catch (e) {
      console.warn(e);
      onError('Cannot create application', e.message);
    }
  }

  return (
    <form onChange={onChange} ref={formElementRef} onSubmit={handleFormSubmit}>
      <FormSet>
        <TextFormItem
          inputKey="name"
          required
          inputProps={{ pattern: applicationNameRegex }}
          label="Name"
          placeholder="Specify a name for your Application"
          onChange={e =>
            setApplication({ ...application, name: e.target.value })
          }
        />
        <TextFormItem
          inputKey="description"
          label="Description"
          placeholder="Specify a description for your Application"
          onChange={e =>
            setApplication({ ...application, description: e.target.value })
          }
        />
        <LabelSelectorInput
          showHelp={false}
          labels={application.labels || {}}
          onChange={labels => setApplication({ ...application, labels })}
        />
      </FormSet>
    </form>
  );
}

export default function CreateApplicationModal() {
  return (
    <ModalWithForm
      title="Create Application"
      modalOpeningComponent={<Button glyph="add">Create Application</Button>}
      confirmText="Create"
      renderForm={props => <CreateApplicationForm {...props} />}
    />
  );
}

import React from 'react';
import { Popover, Menu, Button } from 'fundamental-react';
import { ModalWithForm, useGetList } from 'react-shared';
import CreateWorkloadForm from './CreateWorkloadForm/CreateWorkloadForm';
import CreateLambdaModal from 'components/Lambdas/LambdasList/Lambdas/CreateLambdaModal';

export default function DeployNewWorkload({ namespaceName }) {
  const {
    data: functions,
    error: functionsError,
    loading: functionsLoading = true,
  } = useGetList()(
    `/apis/serverless.kyma-project.io/v1alpha1/namespaces/${namespaceName}/functions`,
    { pollingInterval: 5000 },
  );
  const {
    data: repositories,
    error: repositoriesError,
    loading: repositoriesLoading = true,
  } = useGetList()(
    `/apis/serverless.kyma-project.io/v1alpha1/namespaces/${namespaceName}/gitrepositories`,
    { pollingInterval: 5000 },
  );

  const functionNames = (functions || []).map(fn => fn.metadata.name);
  const serverDataError = functionsError || repositoriesError;
  const serverDataLoading = functionsLoading || repositoriesLoading;

  const lambdaModal = (
    <CreateLambdaModal
      functionNames={functionNames}
      repositories={repositories}
      serverDataError={serverDataError}
      serverDataLoading={serverDataLoading}
      modalOpeningComponent={<Menu.Item>Create Function</Menu.Item>}
    />
  );

  const deploymentModal = (
    <ModalWithForm
      title="Add new Deployment"
      confirmText="Create"
      className="add-deployment-modal"
      modalOpeningComponent={<Menu.Item>Create Deployment</Menu.Item>}
      renderForm={props => (
        <CreateWorkloadForm namespaceId={namespaceName} {...props} />
      )}
    />
  );

  const control = (
    <Button option="light" className="fd-has-margin-right-tiny" glyph="add">
      Deploy new workload
    </Button>
  );

  return (
    <Popover
      body={
        <Menu>
          <Menu.List>
            {/* <DeployResourceModal
              namespace={namespaceNameame}
              modalOpeningComponent={<Menu.Item>Upload YAML</Menu.Item>}
            /> */}
            {lambdaModal}
            {deploymentModal}
          </Menu.List>
        </Menu>
      }
      control={control}
      widthSizingType="matchTarget"
      placement="bottom-end"
    />
  );
}

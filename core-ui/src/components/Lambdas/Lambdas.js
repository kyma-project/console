import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import { GenericList, PageHeader, Spinner, Labels } from 'react-shared';
import LambdaStatusBadge from '../../shared/components/LambdaStatusBadge/LambdaStatusBadge';

import ModalWithForm from '../ModalWithForm/ModalWithForm';
import CreateLambdaForm from './CreateLambdaForm/CreateLambdaForm';

import { useLambdasQuery } from 'components/Lambdas/gql/hooks/queries';
import { useDeleteLambda } from 'components/Lambdas/gql/hooks/mutations';

import { TOOLBAR, LAMBDAS_LIST, ERRORS } from './constants';

function CreateLambdaModal() {
  return (
    <ModalWithForm
      title="Create new lambda"
      button={{
        glyph: 'add',
        text: 'Create lambda',
      }}
      id="add-lambda-modal"
      renderForm={props => <CreateLambdaForm {...props} />}
    />
  );
}

const headerRenderer = () => ['Name', 'Labels', 'Status'];
const textSearchProperties = ['name', 'lambda.status.phase'];

export default function Lambdas() {
  const { lambdas, error, loading } = useLambdasQuery({
    namespace: LuigiClient.getEventData().environmentId,
  });
  const deleteLambda = useDeleteLambda({ redirect: false });

  if (error) {
    return `Error! ${error.message}`;
  }

  if (loading) {
    return <Spinner />;
  }

  const actions = [
    {
      name: 'Delete',
      handler: lambda => {
        deleteLambda(lambda);
      },
    },
  ];
  const rowRenderer = lambda => [
    <span
      className="link"
      data-test-id="lambda-name"
      onClick={() =>
        LuigiClient.linkManager().navigate(`details/${lambda.name}`)
      }
    >
      {lambda.name}
    </span>,
    <Labels labels={lambda.labels} />,
    <LambdaStatusBadge status={lambda.status.phase} />,
  ];

  const headerActions = <CreateLambdaModal />;

  return (
    <>
      <PageHeader
        title={TOOLBAR.TITLE}
        description={TOOLBAR.DESCRIPTION}
        actions={headerActions}
      />
      <GenericList
        actions={actions}
        entries={lambdas}
        showSearchField={true}
        showSearchSuggestion={false}
        textSearchProperties={textSearchProperties}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        notFoundMessage={LAMBDAS_LIST.ERRORS.RESOURCES_NOT_FOUND}
        noSearchResultMessage={LAMBDAS_LIST.ERRORS.NOT_MATCHING_SEARCH_QUERY}
        serverErrorMessage={ERRORS.SERVER}
      />
    </>
  );
}

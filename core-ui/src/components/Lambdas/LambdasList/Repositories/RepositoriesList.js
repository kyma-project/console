import React from 'react';

import { GenericList, CopiableLink } from 'react-shared';
import { Badge, Icon } from 'fundamental-react';

import {
  CreateRepositoryModal,
  UpdateRepositoryModal,
} from './RepositoryModal';
import { useDeleteRepository } from 'components/Lambdas/gql/hooks/mutations';

import { repositoryAuthType } from 'components/Lambdas/helpers/repositories';
import {
  REPOSITORIES_LIST,
  ERRORS,
  REFETCH_LAMBDAS_TIMEOUT,
} from 'components/Lambdas/constants';

function RepositoryAuth({ type = '' }) {
  return (
    <Badge modifier="filled">
      <Icon glyph={type === '' ? 'unlocked' : 'locked'} size="s" />
      {repositoryAuthType[type]}
    </Badge>
  );
}

const headerRenderer = () => ['Name', 'Url', 'Authentication', 'Secret name'];
const textSearchProperties = [
  'name',
  'spec.url',
  'spec.auth.type',
  'spec.auth.secretName',
];

export default function RepositoriesList({
  repositories = [],
  serverDataError = false,
  serverDataLoading = false,
  refetchRepositories,
}) {
  const onSuccessCallback = () => {
    setTimeout(() => {
      refetchRepositories();
    }, REFETCH_LAMBDAS_TIMEOUT);
  };

  const repositoryNames = repositories.map(l => l.name);
  const headerActions = (
    <CreateRepositoryModal
      repositoryNames={repositoryNames}
      serverDataError={serverDataError || false}
      serverDataLoading={serverDataLoading || false}
      onSuccessCallback={onSuccessCallback}
    />
  );

  const deleteRepository = useDeleteRepository({
    redirect: false,
    onSuccessCallback,
  });

  const actions = [
    {
      name: 'Edit',
      component: repository => (
        <UpdateRepositoryModal
          repository={repository}
          repositoryNames={repositoryNames}
          serverDataError={serverDataError || false}
          serverDataLoading={serverDataLoading || false}
          onSuccessCallback={onSuccessCallback}
        />
      ),
    },
    {
      name: 'Delete',
      handler: repository => {
        deleteRepository(repository);
      },
    },
  ];
  const rowRenderer = repository => [
    <span>{repository.name}</span>,
    <CopiableLink url={repository.spec.url} />,
    <RepositoryAuth {...(repository.spec.auth || {})} />,
    <span>{repository.spec.auth ? repository.spec.auth.secretName : '-'}</span>,
  ];

  return (
    <GenericList
      actions={actions}
      entries={repositories}
      showSearchField={true}
      showSearchSuggestion={false}
      textSearchProperties={textSearchProperties}
      extraHeaderContent={headerActions}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      serverDataError={serverDataError}
      serverDataLoading={serverDataLoading}
      notFoundMessage={REPOSITORIES_LIST.ERRORS.RESOURCES_NOT_FOUND}
      noSearchResultMessage={REPOSITORIES_LIST.ERRORS.NOT_MATCHING_SEARCH_QUERY}
      serverErrorMessage={ERRORS.SERVER}
    />
  );
}

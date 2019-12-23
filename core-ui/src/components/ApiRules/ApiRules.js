import React from 'react';
import { PageHeader, GenericList, Spinner } from 'react-shared';
import { useQuery, useMutation } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';
import { Button } from 'fundamental-react';

import { GET_API_RULES } from 'gql/queries';
import { DELETE_API_RULE } from 'gql/mutations';
import { useNotification } from 'contexts/notifications';

const ApiRules = () => {
  const [deleteAPIRule] = useMutation(DELETE_API_RULE);
  const notificationManager = useNotification();
  const namespace = LuigiClient.getContext().namespaceId;

  const { loading, error, data, refetch } = useQuery(GET_API_RULES, {
    variables: { namespace },
    fetchPolicy: 'no-cache',
  });

  if (error) {
    return `Error! ${error.message}`;
  }

  if (loading) {
    return <Spinner />;
  }

  const headerRenderer = () => ['Name'];

  const rowRenderer = rule => [
    <span
      className="link"
      onClick={() =>
        LuigiClient.linkManager()
          .fromClosestContext()
          .navigate(`details/${rule.name}`)
      }
    >
      {rule.name}
    </span>,
  ];

  const actions = [
    {
      name: 'Edit',
      handler: entry => {
        console.log('edit', entry);
      },
    },
    {
      name: 'Delete',
      handler: entry => {
        handleAPIDelete(entry.name, namespace);
      },
    },
  ];

  const showNotification = (type, message) => {
    notificationManager.notify({
      content: message,
      title: type,
      color: type === 'Error' ? '#BB0000' : '#107E3E',
      icon: type === 'Error' ? 'decline' : 'accept',
      autoClose: !(type === 'Error'),
    });
  };

  const handleAPIDelete = (name, namespace) => {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: `Remove ${name}`,
        body: `Are you sure you want to delete rule "${name}"?`,
        buttonConfirm: 'Delete',
        buttonDismiss: 'Cancel',
      })
      .then(async () => {
        try {
          const deletedAPIRule = await deleteAPIRule({
            variables: { name, namespace },
          });
          const isSuccess =
            deletedAPIRule.data &&
            deletedAPIRule.data.deleteAPIRule &&
            deletedAPIRule.data.deleteAPIRule.name === name;
          if (isSuccess) {
            showNotification('Success', `API rule ${name} deleted`);
            try {
              refetch();
            } catch (e) {
              console.warn(e);
              showNotification(
                'Error',
                `Error while getting an updated list of API rules: ${e.message}`,
              );
            }
          }
        } catch (e) {
          console.warn(e);
          showNotification(
            'Error',
            `Error while removing API rule ${name}: ${e.message}`,
          );
        }
      })
      .catch(() => {});
  };

  return (
    <>
      <PageHeader title="API rules" />
      <GenericList
        actions={actions}
        entries={data.APIRules}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        extraHeaderContent={
          <Button
            glyph="add"
            option="light"
            onClick={() =>
              LuigiClient.linkManager()
                .fromClosestContext()
                .navigate(`/create`)
            }
          >
            Add new API rule
          </Button>
        }
      />
    </>
  );
};

export default ApiRules;

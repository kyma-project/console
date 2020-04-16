import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { ActionBar, Button, Breadcrumb } from 'fundamental-react';

import { useDeleteLambda } from 'components/Lambdas/gql/hooks/mutations';

export default function LambdaDetailsHeader({ lambda }) {
  const deleteLambda = useDeleteLambda({
    redirect: true,
  });

  function navigateToList() {
    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate('');
  }

  return (
    <header className="fd-has-background-color-background-2">
      <section className="fd-has-padding-regular fd-has-padding-bottom-none action-bar-wrapper">
        <section>
          <Breadcrumb>
            <Breadcrumb.Item
              name="Lambdas"
              url="#"
              onClick={() => navigateToList()}
            />
            <Breadcrumb.Item />
          </Breadcrumb>
          <ActionBar.Header title={lambda.name || 'Loading name...'} />
        </section>
        <ActionBar.Actions>
          <Button
            onClick={() => deleteLambda(lambda)}
            option="light"
            type="negative"
          >
            Delete
          </Button>
        </ActionBar.Actions>
      </section>
    </header>
  );
}

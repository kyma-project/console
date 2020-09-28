import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import LuigiClient from '@luigi-project/client';
import { Button } from 'fundamental-react';

import { GET_API_RULE } from '../../../gql/queries';
import { Spinner, PageHeader, useSideDrawerEditor } from 'react-shared';
import EntryNotFound from 'components/EntryNotFound/EntryNotFound';

import AccessStrategies from '../AccessStrategies/AccessStrategies';
import ApiRuleStatus from '../ApiRuleStatus/ApiRuleStatus';
import {
  CopiableApiRuleHost,
  ApiRuleServiceInfo,
} from 'components/ApiRules/ApiRulesList/components';

import { useDeleteApiRule } from '../gql/useDeleteApiRule';

const ApiRuleDetails = ({ apiName }) => {
  const [drawerEditor, setDrawerEditorContent] = useSideDrawerEditor(
    null,
    null,
    true,
    null,
  );
  const { error, loading, data } = useQuery(GET_API_RULE, {
    variables: {
      namespace: LuigiClient.getContext().namespaceId,
      name: apiName,
    },
    fetchPolicy: 'no-cache',
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <h1>Couldn't fetch API rule data</h1>;
  }

  if (!data.APIRule) {
    return <EntryNotFound entryType="API Rule" entryId={apiName} />;
  }

  return (
    <>
      {drawerEditor}
      <ApiRuleDetailsHeader
        apiRule={data.APIRule}
        setDrawerEditorContent={setDrawerEditorContent}
      />
      <AccessStrategies strategies={data.APIRule?.spec?.rules || []} />
    </>
  );
};

ApiRuleDetails.propTypes = {
  apiName: PropTypes.string.isRequired,
};

export default ApiRuleDetails;

function onDeleteSuccess() {
  LuigiClient.linkManager()
    .fromClosestContext()
    .navigate('');
}

function DeleteButton({ apiRuleName }) {
  const [handleAPIRuleDelete] = useDeleteApiRule(onDeleteSuccess);
  return (
    <Button
      onClick={() => handleAPIRuleDelete(apiRuleName)}
      option="light"
      type="negative"
      aria-label="delete-api-rule"
    >
      Delete
    </Button>
  );
}

function EditButton({ apiRuleName }) {
  return (
    <Button
      onClick={() => navigateToEditView(apiRuleName)}
      option="emphasized"
      aria-label="edit-api-rule"
    >
      Edit
    </Button>
  );
}

function navigateToEditView(apiRuleName) {
  LuigiClient.linkManager()
    .fromClosestContext()
    .navigate(`/edit/${apiRuleName}`);
}

const breadcrumbItems = [{ name: 'API Rules', path: '/' }, { name: '' }];

function ApiRuleDetailsHeader({ apiRule, setDrawerEditorContent }) {
  const name = apiRule.name;
  const { openedInModal = false } = LuigiClient.getNodeParams() || {};
  const openedInModalBool = openedInModal.toString().toLowerCase() === 'true';

  return (
    <PageHeader
      title={openedInModalBool ? '' : name}
      breadcrumbItems={openedInModalBool ? [] : breadcrumbItems}
      actions={
        openedInModalBool ? null : (
          <>
            {apiRule.json && (
              <Button
                option="light"
                onClick={_ => setDrawerEditorContent(apiRule.json)}
              >
                Code
              </Button>
            )}
            <EditButton apiRuleName={name} />
            <DeleteButton apiRuleName={name} />
          </>
        )
      }
    >
      <PageHeader.Column title="Service">
        <ApiRuleServiceInfo apiRule={apiRule} />
      </PageHeader.Column>
      <PageHeader.Column title="Host" columnSpan="2 / 4">
        <CopiableApiRuleHost apiRule={apiRule} />
      </PageHeader.Column>
      <PageHeader.Column title="Status" columnSpan="4 / 4">
        <ApiRuleStatus apiRule={apiRule} />
      </PageHeader.Column>
    </PageHeader>
  );
}

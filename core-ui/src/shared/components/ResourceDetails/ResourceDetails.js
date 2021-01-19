import React from 'react';
import PropTypes from 'prop-types';
import jsyaml from 'js-yaml';
import { Link } from 'fundamental-react';
import { createPatch } from 'rfc6902';
import Moment from 'react-moment';
import LuigiClient from '@luigi-project/client';

import {
  PageHeader,
  YamlEditorProvider,
  GenericList,
  Labels,
  useYamlEditor,
  useNotification,
  useGet,
  useUpdate,
  useDelete,
} from 'react-shared';

export default function ResourceDetails({
  resourceUrl,
  resourceType,
  resourceName,
  namespace,
}) {
  if (!resourceUrl) {
    return <></>; // wait for the context update
  }
  const generatedResourceUrl = resourceUrl.includes(':namespaceId')
    ? resourceUrl.replace(':namespaceId', namespace)
    : resourceUrl;

  return (
    <YamlEditorProvider>
      <PageHeader title={resourceName} />
      <Resource
        resourceUrl={generatedResourceUrl}
        namespace={namespace}
        resourceName={resourceName}
      />
    </YamlEditorProvider>
  );
}

function Resource({ resourceUrl, namespace, resourceName }) {
  return (
    'This is a generic resource details component for resource ' + resourceName
  );
}

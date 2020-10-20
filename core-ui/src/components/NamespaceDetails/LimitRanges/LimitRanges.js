import React, { useRef } from 'react';
import { GenericList, useYamlEditor, useNotification } from 'react-shared';
import { Icon } from 'fundamental-react';
import jsyaml from 'js-yaml';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_LIMIT_RANGE } from '../../../gql/mutations';
import { GET_NAMESPACE } from '../../../gql/queries';
import { formatMessage } from 'components/Lambdas/helpers/misc';

const isNotEmpty = variable => variable && variable !== '0';

const headerRenderer = _ => [
  'Name',
  'Type',
  'Max',
  'Default',
  'Default request ',
];

const getCPUandMemoryInfo = (cpuInfo, memoryInfo, keyPrefix) => {
  let output = [
    isNotEmpty(cpuInfo) && (
      <React.Fragment key={keyPrefix + 'cpu'}>
        {cpuInfo} {<Icon glyph="simulate" />}
      </React.Fragment>
    ),
    isNotEmpty(cpuInfo) && isNotEmpty(memoryInfo) && (
      <React.Fragment key={keyPrefix + 'delim'}> | </React.Fragment>
    ),
    isNotEmpty(memoryInfo) && (
      <React.Fragment key={keyPrefix + 'mem'}>
        {memoryInfo} {<Icon glyph="course-book" />}
      </React.Fragment>
    ),
  ];

  return output.filter(o => o);
};

const rowRenderer = limitRange => {
  const limit = limitRange.spec.limits[0];
  if (!limit) return [limitRange.name, ...Array(4).fill('-')];

  return [
    limitRange.name,
    limit.type,
    getCPUandMemoryInfo(limit.max.cpu, limit.max.memory, limitRange.name),
    getCPUandMemoryInfo(
      limit.default.cpu,
      limit.default.memory,
      limitRange.name,
    ),
    getCPUandMemoryInfo(
      limit.defaultRequest.cpu,
      limit.defaultRequest.memory,
      limitRange.name,
    ),
  ];
};

const LimitRanges = ({ limitRanges, namespaceName: namespace }) => {
  const notificationManager = useNotification();
  const editedLimitRange = useRef(null);
  const setEditedJson = useYamlEditor();

  function onUpdateError(e) {
    console.error(e);
    notificationManager.notifyError({
      content: 'Failed to update the LimitRange',
    });
  }

  const [updateLimitRange] = useMutation(UPDATE_LIMIT_RANGE, {
    onError: onUpdateError,
    onCompleted: ({ updateLimitRange }) =>
      notificationManager.notifySuccess({
        content: formatMessage('Succesfully updated', updateLimitRange.name),
      }),
    refetchQueries: [{ query: GET_NAMESPACE, variables: { name: namespace } }],
  });

  async function handleSaveClick(newYAML) {
    let json;

    try {
      json = jsyaml.safeLoad(newYAML);
      if (json.metadata?.resourceVersion) delete json.metadata.resourceVersion; // TODO: do this on the backend side
    } catch (e) {
      onUpdateError(e);
      return e;
    }

    await updateLimitRange({
      variables: {
        name: editedLimitRange.current?.name,
        json,
        namespace,
      },
    });
  }

  const actions = [
    {
      name: <Icon glyph="edit" />,
      handler: limitRange => {
        editedLimitRange.current = limitRange;
        setEditedJson(limitRange.json, handleSaveClick);
      },
    },
  ];

  return (
    <GenericList
      hasExternalMargin={false}
      title="Limit ranges"
      notFoundMessage="No limit ranges"
      entries={limitRanges}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      actions={actions}
      className="namespace-limits"
    />
  );
};
export default LimitRanges;

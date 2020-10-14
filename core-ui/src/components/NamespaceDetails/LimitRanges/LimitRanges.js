import React, { useRef } from 'react';
import {
  GenericList,
  useYamlEditorDrawer,
  useNotification,
} from 'react-shared';
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

  return [
    limitRange.name,
    limit.limitType,
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

const LimitRanges = ({ limitRanges, namespace }) => {
  const notificationManager = useNotification();
  const editedLimitRange = useRef(null);

  function onUpdateError() {
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

  function handleSaveClick(newYAML) {
    let json;

    try {
      json = jsyaml.safeLoad(newYAML);
      if (json.metadata?.resourceVersion) delete json.metadata.resourceVersion; // TODO: do this on the backend side
    } catch (e) {
      console.error(e);
      onUpdateError();
      return;
    }

    updateLimitRange({
      variables: { name: editedLimitRange.current?.name, json, namespace },
    });
  }

  const [drawer, setDrawerContent] = useYamlEditorDrawer(handleSaveClick);

  const actions = [
    {
      name: <Icon glyph="edit" />,
      handler: limitRange => {
        editedLimitRange.current = limitRange;
        setDrawerContent(limitRange.json);
      },
    },
  ];

  return (
    <>
      {drawer}
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
    </>
  );
};
export default LimitRanges;

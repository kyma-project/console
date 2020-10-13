import React, { useRef } from 'react';
import { GenericList, useSideDrawer } from 'react-shared';
import { Icon, Button } from 'fundamental-react';
import jsyaml from 'js-yaml';
import { ControlledEditor } from '@monaco-editor/react';

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

const LimitRanges = ({ limitRanges }) => {
  const editedLimitRange = useRef(null);
  const changedYAML = useRef(null);

  function handleSaveClick(newYAML) {
    const json = jsyaml.safeLoad(newYAML);
  }

  const bottomContent = (
    <Button
      className="fd-has-margin-right-small"
      glyph="accept"
      type="positive"
      option="emphasized"
      onClick={() => handleSaveClick(changedYAML.current)}
    >
      Save
    </Button>
  );

  const [drawer, setDrawerContent] = useSideDrawer(
    null,
    bottomContent,
    true,
    null,
  );

  const YamlContent = json => (
    <>
      <h1 className="fd-has-type-4">YAML</h1>
      <ControlledEditor
        height="90vh"
        width="50em"
        language={'yaml'}
        theme="vs-light"
        value={jsyaml.safeDump(json)}
        onChange={(_, text) => (changedYAML.current = text)}
      />
    </>
  );

  const actions = [
    {
      name: <Icon glyph="edit" />,
      handler: limitRange => {
        changedYAML.current = null;
        editedLimitRange.current = limitRange;
        setDrawerContent(YamlContent(limitRange.json));
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

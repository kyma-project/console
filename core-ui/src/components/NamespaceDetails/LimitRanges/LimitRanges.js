import React from 'react';
import './LimitRanges.scss';
import { GenericList } from 'react-shared';
import { Icon } from 'fundamental-react';

const headerRenderer = _ => [
  'Name',
  'Type',
  'Max',
  'Default',
  'Default request ',
];

const getCPUandMemoryInfo = (cpuInfo, memoryInfo, keyPrefix) => {
  let output = [
    cpuInfo && (
      <React.Fragment key={keyPrefix + 'cpu'}>
        {cpuInfo} {<Icon glyph="simulate" />}
      </React.Fragment>
    ),
    (cpuInfo && memoryInfo && (
      <React.Fragment key={keyPrefix + 'delim'}> / </React.Fragment>
    ),
    memoryInfo && (
      <React.Fragment key={keyPrefix + 'mem'}>
        {memoryInfo} {<Icon glyph="course-book" />}
      </React.Fragment>
    )),
  ];
  return output.filter(o => o);
};

const rowRenderer = limitRange => {
  const limit = limitRange.limits[0];

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
  console.log(limitRanges);

  return (
    <GenericList
      hasExternalMargin={false}
      title="Limit ranges"
      notFoundMessage="No limit ranges"
      entries={limitRanges}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      actions={[]}
      className="namespace-limits"
    />
  );
};
export default LimitRanges;

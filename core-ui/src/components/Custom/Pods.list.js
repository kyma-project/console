import React from 'react';

export const PodsList = ({ PredefinedRenderer, ...otherParams }) => {
  const customColumns = [
    {
      header: 'Status',
      value: pod => (
        <>
          {pod.metadata.name}
          <h1 style={{ color: 'magenta' }}>this is tatus</h1>
        </>
      ),
    },
  ];

  return (
    <>
      <PredefinedRenderer customColumns={customColumns} {...otherParams} />
      <h1
        style={{
          fontSize: '3em',
          color: 'pink',
          transform: 'scaley(4)',
          textShadow: '1px 1px 2px #555',
        }}
      >
        This is a custom pod list, basing on the generic one
      </h1>
    </>
  );
};

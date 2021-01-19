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

  return <PredefinedRenderer customColumns={customColumns} {...otherParams} />;
};

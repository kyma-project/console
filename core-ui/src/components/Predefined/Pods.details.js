import React from 'react';

export const PodsDetails = DefaultRenderer => ({ ...otherParams }) => {
  const customColumns = [
    {
      header: 'Limits',
      value: resource => {
        console.log(resource);
        return 'todo';
      },
    },
  ];

  return <DefaultRenderer customColumns={customColumns} {...otherParams} />;
};

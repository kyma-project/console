import React from 'react';
import { Labels } from 'react-shared';
import './Application.scss';

import ApplicationServices from './ApplicationServices';
import NamespaceBindings from './NamespaceBindings';
import ConnectApplicationModal from './ConnectApplicationModal';

export const ApplicationsDetails = DefaultRenderer => ({ ...otherParams }) => {
  const customColumns = [
    {
      header: 'Descritpion',
      value: app => app.spec.description || '-',
    },
    {
      header: 'Labels',
      value: app => <Labels labels={app.spec.labels} />,
    },
  ];
  return (
    <DefaultRenderer
      customColumns={customColumns}
      headerActions={
        <ConnectApplicationModal applicationName={otherParams.resourceName} />
      }
      customComponents={[NamespaceBindings, ApplicationServices]}
      {...otherParams}
    ></DefaultRenderer>
  );
};

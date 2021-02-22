import React from 'react';
import CreateApplicationModal from './CreateApplicationModal';

export const ApplicationsList = DefaultRenderer => ({ ...otherParams }) => {
  const customHeaderActions = <CreateApplicationModal />;
  //   const customColumns = [
  //     {
  //       header: 'Connected Namespaces',
  //       value: app => {
  //         console.log(app);
  //         return (
  //           <p>ok</p>
  //         );
  //       },
  //     },
  //   ];
  return (
    <DefaultRenderer
      customHeaderActions={customHeaderActions}
      //   customColumns={customColumns}
      {...otherParams}
    />
  );
};

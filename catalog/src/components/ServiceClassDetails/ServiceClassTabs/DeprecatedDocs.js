import React from 'react';
import { Markdown, Tab } from '@kyma-project/react-components';
const validatDocumentsByType = type => {
  let numberOfSources = 0;
  for (let item = 0; item < type.length; item++) {
    if (type[item].source || type[item].Source) numberOfSources++;
  }
  return numberOfSources > 0;
};

export const DeprecatedDocs = ({ documentsTypes, documentsByType }) => {
  return (
    documentsTypes &&
    documentsTypes.map(type =>
      documentsByType &&
      documentsByType[type] &&
      validatDocumentsByType(documentsByType[type]) ? (
        <Tab key={type} title={type}>
          <Markdown>
            {documentsByType[type].map((item, i) => {
              return item.source || item.Source ? (
                <div
                  key={i}
                  dangerouslySetInnerHTML={{
                    __html: item.source || item.Source,
                  }}
                />
              ) : null;
            })}
          </Markdown>
        </Tab>
      ) : null,
    )
  );
};

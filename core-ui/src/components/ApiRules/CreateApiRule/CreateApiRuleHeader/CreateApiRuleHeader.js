import React from 'react';
import { Button } from 'fundamental-react';
import copyToCliboard from 'copy-to-clipboard';
import { PageHeader, Tooltip } from 'react-shared';
import './CreateApiRuleHeader.scss';

const breadcrumbItems = [{ name: 'API Rules', path: '/' }, { name: '' }];

const CopiableURL = ({ url }) => (
  <div className="copiable-url">
    {url}
    <Tooltip title="Copy to clipboard" position="top">
      <Button
        option="light"
        compact
        glyph="copy"
        onClick={() => copyToCliboard(url)}
      />
    </Tooltip>
  </div>
);

const CreateApiRuleHeader = ({
  handleCreate,
  apiData,
  isValid,
  isInViewMode,
}) => {
  return (
    <PageHeader
      title={
        isInViewMode
          ? (apiData && apiData.name) || 'Loading name...'
          : 'Create API Rule'
      }
      breadcrumbItems={breadcrumbItems}
      actions={
        !isInViewMode ? (
          <Button
            onClick={handleCreate}
            disabled={!isValid}
            option="emphasized"
            aria-label="submit-form"
          >
            Create
          </Button>
        ) : null
      }
    >
      {isInViewMode && (
        <>
          <PageHeader.Column key="host" title="Host">
            {(apiData && apiData.service && (
              <CopiableURL url={`https://${apiData.service.host}`} />
            )) ||
              'Loading host...'}
          </PageHeader.Column>
          <PageHeader.Column key="service" title="Service">
            {(apiData &&
              apiData.service &&
              `${apiData.service.name} (port: ${apiData.service.port})`) ||
              'Loading service...'}
          </PageHeader.Column>
        </>
      )}
    </PageHeader>
  );
};

export default CreateApiRuleHeader;

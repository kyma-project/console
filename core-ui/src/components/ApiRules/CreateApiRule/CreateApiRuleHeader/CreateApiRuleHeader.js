import React from 'react';
import { Button } from 'fundamental-react';
import { PageHeader } from 'react-shared';

const breadcrumbItems = [{ name: 'API Rules', path: '/' }, { name: '' }];

const CreateApiRuleHeader = ({ handleCreate, isValid }) => {
  return (
    <PageHeader
      title="Create API Rule"
      breadcrumbItems={breadcrumbItems}
      actions={
        <Button
          onClick={handleCreate}
          disabled={!isValid}
          option="emphasized"
          aria-label="submit-form"
        >
          Create
        </Button>
      }
    />
  );
};

export default CreateApiRuleHeader;

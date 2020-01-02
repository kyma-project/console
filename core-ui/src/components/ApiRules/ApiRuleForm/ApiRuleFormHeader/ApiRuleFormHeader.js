import React from 'react';
import { Button } from 'fundamental-react';
import { PageHeader } from 'react-shared';

const ApiRuleFormHeader = ({
  handleSave,
  isValid,
  title,
  saveButtonText,
  breadcrumbItems,
}) => {
  return (
    <PageHeader
      title={title}
      breadcrumbItems={breadcrumbItems}
      actions={
        <Button
          onClick={handleSave}
          disabled={!isValid}
          option="emphasized"
          aria-label="submit-form"
        >
          {saveButtonText}
        </Button>
      }
    />
  );
};

export default ApiRuleFormHeader;

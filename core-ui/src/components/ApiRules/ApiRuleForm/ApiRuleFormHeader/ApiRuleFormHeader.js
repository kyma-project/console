import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import PropTypes from 'prop-types';
import { Button, Link } from 'fundamental-react';
import { PageHeader } from 'react-shared';

const ApiRuleFormHeader = ({
  handleSave,
  isValid,
  title,
  saveButtonText,
  breadcrumbItems,
}) => {
  const { serviceName } = LuigiClient.getNodeParams();

  const serviceLink = serviceName && (
    <PageHeader.Column title="Service">
      <Link
        className="link"
        onClick={() =>
          LuigiClient.linkManager()
            .fromContext('namespaces')
            .navigate(`services/details/${serviceName}`)
        }
      >
        {serviceName}
      </Link>
    </PageHeader.Column>
  );

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
    >
      {serviceLink}
    </PageHeader>
  );
};

ApiRuleFormHeader.propTypes = {
  handleSave: PropTypes.func.isRequired,
  isValid: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  saveButtonText: PropTypes.string.isRequired,
  breadcrumbItems: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string,
    }),
  ),
};

export default ApiRuleFormHeader;

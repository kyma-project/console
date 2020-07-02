import React from 'react';
import LuigiClient from '@luigi-project/client';
import PropTypes from 'prop-types';

import { Button, Link } from 'fundamental-react';
import { PageHeader } from 'react-shared';

import './ApiRuleFormHeader.scss';

const ApiRuleFormHeader = ({
  handleSave,
  isValid,
  title,
  saveButtonText,
  breadcrumbItems,
  serviceName = undefined,
  openedInModalBool = false,
}) => {
  const serviceLink = !openedInModalBool && serviceName && (
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
    <div className="api-rule-form__header">
      <PageHeader
        title={openedInModalBool ? '' : title}
        breadcrumbItems={openedInModalBool ? [] : breadcrumbItems}
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
    </div>
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

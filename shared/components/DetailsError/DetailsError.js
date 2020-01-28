import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'fundamental-react';

import { PageHeader } from '../PageHeader/PageHeader';

export const DetailsError = ({ breadcrumbs, message }) => {
  return (
    <>
      <PageHeader title="" breadcrumbItems={breadcrumbs} />
      <Panel className="fd-has-padding-regular fd-has-margin-regular">
        {message}
      </Panel>
    </>
  );
};

DetailsError.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.object).isRequired,
  message: PropTypes.string.isRequired,
};

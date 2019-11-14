import React, { useContext } from 'react';
import { Spinner } from '@kyma-project/components';
import './AddonList.scss';

import AddonPanel from './../AddonPanel/AddonPanel';

import { QueriesService, ConfigurationsService } from '../../services';

import { ERRORS } from '../../constants';

const AddonList: React.FunctionComponent = ({}) => {
  const { error, loading = true } = useContext(QueriesService);
  const { configurationsExist, filteredConfigs } = useContext(
    ConfigurationsService,
  );

  if (loading) {
    return <Spinner />;
  }
  if (!configurationsExist()) {
    return <div className="error-wrapper">{ERRORS.RESOURCES_NOT_FOUND}</div>;
  }
  if (error) {
    return <div className="error-wrapper">{ERRORS.SERVER}</div>;
  }
  return (
    <section className="fd-has-margin-m" id="addon-list">
      {filteredConfigs.map(config => (
        <AddonPanel key={config.name} config={config} />
      ))}
    </section>
  );
};

export default AddonList;

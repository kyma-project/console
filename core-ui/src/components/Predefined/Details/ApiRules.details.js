import React from 'react';

import { Button } from 'fundamental-react';
import LuigiClient from '@luigi-project/client';
import { PANEL } from '../../ApiRules/constants';

import {
  CopiableApiRuleHost,
  ApiRuleServiceInfo,
} from 'components/ApiRules/ApiRulesList/components';
import ApiRuleStatus from 'components/ApiRules/ApiRuleStatus/ApiRuleStatus';
import AccessStrategies from 'components/ApiRules/AccessStrategies/AccessStrategies';

export const ApiRulesDetails = DefaultRenderer => ({ ...otherParams }) => {
  const customColumns = [
    {
      header: 'Status',
      value: resource => <ApiRuleStatus apiRule={resource} />,
    },
    {
      header: 'Service',
      value: resource => <ApiRuleServiceInfo apiRule={resource} />,
    },
    {
      header: 'Host',
      value: resource => <CopiableApiRuleHost apiRule={resource} />,
    },
  ];

  const ApiRulesAccessStrategies = (resource, resourceUrl) => {
    return <AccessStrategies strategies={resource?.spec?.rules || []} />;
  };

  const editApiRule = apirule => {
    return (
      <Button
        glyph="add"
        option="light"
        onClick={() =>
          LuigiClient.linkManager()
            .fromContext('namespaces')
            .withParams({
              serviceName: apirule.spec.service.name,
              port: apirule.spec.service.port,
              openedInModal: true,
              redirectCtx: 'namespaces',
              redirectPath: encodeURIComponent('cmf-apirules/'),
            })
            .openAsModal(`cmf-apirules/edit/${apirule.metadata.name}`, {
              title: PANEL.CREATE_MODAL.TITLE,
            })
        }
      >
        Edit apirules
      </Button>
    );
  };

  return (
    <DefaultRenderer
      resourceHeaderActions={[editApiRule]}
      customColumns={customColumns}
      customComponents={[ApiRulesAccessStrategies]}
      {...otherParams}
    />
  );
};

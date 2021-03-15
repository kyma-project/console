import React from 'react';
import { Button } from 'fundamental-react';
import LuigiClient from '@luigi-project/client';
import { PANEL } from '../../ApiRules/constants';
import { CopiableApiRuleHost } from 'components/ApiRules/ApiRulesList/components';
import ApiRuleStatus from 'components/ApiRules/ApiRuleStatus/ApiRuleStatus';
import { useGetGatewayDomain as getGatewayDomain } from 'components/ApiRules/useGetGatewayDomain/useGetGatewayDomain';

export const ApiRulesList = DefaultRenderer => ({ ...otherParams }) => {
  const { domain } = getGatewayDomain();

  const createApiRule = (
    <Button
      glyph="add"
      option="light"
      onClick={() =>
        LuigiClient.linkManager()
          .fromContext('namespaces')
          .withParams({
            serviceName: otherParams.serviceName,
            port: otherParams.port,
            openedInModal: true,
            redirectCtx: 'namespaces',
            redirectPath: encodeURIComponent('cmf-apirules/'),
          })
          .openAsModal(`cmf-apirules/create`, {
            title: PANEL.CREATE_MODAL.TITLE,
          })
      }
    >
      Create apirules
    </Button>
  );
  const customColumns = [
    {
      header: 'Host',
      value: apiRule => (
        <CopiableApiRuleHost apiRule={apiRule} domain={domain} />
      ),
    },
    {
      header: 'Status',
      value: apiRule => <ApiRuleStatus apiRule={apiRule} />,
    },
  ];

  return (
    <DefaultRenderer
      customColumns={customColumns}
      listHeaderActions={createApiRule}
      {...otherParams}
    />
  );
};

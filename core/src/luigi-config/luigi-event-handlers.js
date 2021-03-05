import { setLimitExceededErrorsMessages } from './navigation/navigation-helpers';

export function onQuotaExceed(eventData) {
  const namespace = eventData.namespace;
  const data = eventData.data;
  let limitHasBeenExceeded;
  let limitExceededErrors;
  if (data && data.resourceQuotasStatus) {
    limitHasBeenExceeded = data.resourceQuotasStatus.exceeded;
  }
  if (
    data &&
    data.resourceQuotasStatus &&
    data.resourceQuotasStatus.exceededQuotas &&
    data.resourceQuotasStatus.exceededQuotas.length > 0
  ) {
    limitExceededErrors = setLimitExceededErrorsMessages(
      data.resourceQuotasStatus.exceededQuotas
    );
    const linkdata = {
      goToResourcesConfig: {
        text: 'Resources Configuration',
        url: `/home/namespaces/${namespace}/resources`,
      },
    };
    let errorText = `Error ! The following resource quota limit has been exceeded by the given resource:<br>`;
    limitExceededErrors.forEach((error) => {
      errorText += `-${error}<br>`;
    });
    errorText += `See {goToResourcesConfig} for details.`;
    const settings = {
      text: errorText,
      type: 'error',
      links: linkdata,
    };
    window.postMessage(
      {
        msg: 'luigi.ux.alert.show',
        data: { settings },
      },
      '*'
    );
  }
}

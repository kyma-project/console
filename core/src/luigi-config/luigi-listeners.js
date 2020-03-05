import {
  setLimitExceededErrorsMessages
} from './navigation/navigation-helpers';

window.addEventListener('message', e => {
  const SHOW_SYSTEM_NAMESPACES_CHANGE_EVENT =
    'showSystemNamespacesChangedEvent';

  if (e.data && e.data.msg === 'luigi.refresh-context-switcher') {
    window.Luigi.cachedNamespaces = null;
  } else if (e.data && e.data.msg === SHOW_SYSTEM_NAMESPACES_CHANGE_EVENT) {
    Luigi.customMessages().sendToAll({
      id: SHOW_SYSTEM_NAMESPACES_CHANGE_EVENT,
      showSystemNamespaces: e.data.showSystemNamespaces
    });
  }
});

window.addEventListener('message', e => {
  if (e.data.msg && e.data.msg === 'console.quotaexceeded') {
    const namespace = e.data.namespace;
    const data = e.data.data;
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
          url: `/home/namespaces/${namespace}/resources`
        }
      };
      let errorText = `Error ! The following resource quota limit has been exceeded by the given resource:<br>`;
      limitExceededErrors.forEach(error => {
        errorText += `-${error}<br>`;
      });
      errorText += `See {goToResourcesConfig} for details.`;
      const settings = {
        text: errorText,
        type: 'error',
        links: linkdata
      };
      window.postMessage(
        {
          msg: 'luigi.ux.alert.show',
          data: { settings }
        },
        '*'
      );
    }
  }
});

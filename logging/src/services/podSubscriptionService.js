import createUseContext from 'constate';

export const podSubscriptionService = () => {
  return {};
};

const { Provider, Context } = createUseContext(podSubscriptionService);
export {
  Provider as PodSubscriptionServiceProvider,
  Context as PodSubscriptionServiceContext,
};

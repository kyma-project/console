import LuigiClient from '@luigi-project/client';

export function useShowSystemNamespaces() {
  return (LuigiClient.getActiveFeatureToggles() || []).includes(
    'showSystemNamespaces',
  );
}

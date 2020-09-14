import LuigiClient from '@luigi-project/client';
import { useMemo } from 'react';

export function useShowSystemNamespaces() {
  return useMemo(
    () =>
      (LuigiClient.getActiveFeatureToggles() || []).includes(
        'showSystemNamespaces',
      ),
    [],
  );
}

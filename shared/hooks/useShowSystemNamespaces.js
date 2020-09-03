import LuigiClient from '@luigi-project/client';
import { useEffect, useState } from 'react';

export function useShowSystemNamespaces() {
  const [showSystemNamespaces, setShowSystemNamespaces] = useState(
    (LuigiClient.getActiveFeatureToggles() || []).includes(
      'showSystemNamespaces',
    ),
  );

  useEffect(() => {
    const systemNSenabled = (
      LuigiClient.getActiveFeatureToggles() || []
    ).includes('showSystemNamespaces');
    if (systemNSenabled !== showSystemNamespaces) {
      setShowSystemNamespaces(!!systemNSenabled);
    }
  }, [showSystemNamespaces, setShowSystemNamespaces]);

  return showSystemNamespaces;
}

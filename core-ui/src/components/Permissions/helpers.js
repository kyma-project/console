import { useConfig, useMicrofrontendContext } from 'react-shared';

export class HttpError extends Error {
  constructor(message, statusCode) {
    if ([401, 403].includes(statusCode)) {
      super('You are not allowed to perform this operation');
    } else {
      super(message);
    }
    this.code = statusCode;
    this.originalMessage = message;
  }
}

export async function throwHttpError(response) {
  if (response.headers.get('content-type').includes('json')) {
    try {
      const parsed = await response.json();
      return new HttpError(parsed.message || 'Unknown error', parsed.status);
    } catch (e) {} // proceed to show more generic error
  }

  return new Error(await response.text());
}

export const useCreateBinding = partialUrl => {
  const { idToken } = useMicrofrontendContext();
  const { fromConfig } = useConfig();
  const url =
    fromConfig('apiServerUrl') +
    '/apis/rbac.authorization.k8s.io/v1/' +
    partialUrl;

  return async resource => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
      body: JSON.stringify(resource),
    });

    if (!response.ok) throw await throwHttpError(response);

    return await response.json();
  };
};

export function formatRoleBinding(data) {
  const metadata =
    data.roleKind === 'RoleBinding'
      ? {
          name: data.name,
          namespace: data.namespace,
        }
      : {
          name: data.name,
        };

  const subject = {
    apiGroup: 'rbac.authorization.k8s.io',
    name: data.subjectName,
    kind: data.subjectKind,
  };
  return {
    kind: data.kind,
    metadata: metadata,
    apiVersion: 'rbac.authorization.k8s.io/v1',
    subjects: [subject],
    roleRef: {
      kind: data.roleKind,
      name: data.roleName,
      apiGroup: 'rbac.authorization.k8s.io',
    },
  };
}

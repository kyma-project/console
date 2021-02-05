export const baseUrl = getConfigFn => 'http://localhost:3001';

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

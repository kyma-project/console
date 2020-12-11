export const baseUrl = getConfigFn => getConfigFn('pamelaApiUrl');

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
  try {
    const parsed = await response.json();
    if (!parsed.message) return new Error(response.text());
    return new HttpError(parsed.message, parsed.status);
  } catch (e) {
    return new Error(response.text());
  }
}

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

export default function extractGraphQlErrors(exception) {
  try {
    const { graphQLErrors, networkError } = exception;

    let errorToDisplay = [];
    if (networkError) {
      errorToDisplay = networkError.result.errors
        .map(({ message }) => message)
        .join(' | ');
    } else if (graphQLErrors) {
      errorToDisplay = graphQLErrors.map(({ message }) => message).join(' | ');
    }
    return errorToDisplay;
  } catch (e) {
    if (exception && exception.message) {
      return exception.message;
    }
    return exception;
  }
}

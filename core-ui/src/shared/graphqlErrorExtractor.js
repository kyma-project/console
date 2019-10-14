export default function extractGraphQlErrors(exception) {
  const { graphQLErrors, networkError } = exception;

  try {
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
    return exception;
  }
}

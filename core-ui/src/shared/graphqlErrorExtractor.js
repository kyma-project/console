export default function extractGraphQlErrors(exception) {
  // TODO This should be renamed as this does not work with graphql any more
  if (exception && exception.message) {
    return exception.message;
  }
  return exception;
}

export default function handleApplicationEvent(
  applicationEvent,
  prev,
  refetchQuery,
) {
  let updatedApplications = [...prev.applications];
  switch (applicationEvent.type) {
    case 'ADD':
    case 'DELETE':
      //refresh compass query
      refetchQuery();
      break;

    case 'UPDATE':
      const updatedAppIndex = prev.applications.findIndex(
        a => a.name === applicationEvent.application.name,
      );
      if (~updatedAppIndex) {
        updatedApplications[updatedAppIndex] = applicationEvent.application;
      } else {
        updatedApplications = {
          applications: [...prev.applications, applicationEvent.application],
        };
      }
      break;

    default:
      return prev;
  }

  return updatedApplications.applications;
}

export default function handleApplicationEvent(applicationEvent, prev) {
  switch (applicationEvent.type) {
    case 'ADD':
    case 'DELETE':
      //refresh compass query
      // refetchQuery();
      break;

    case 'UPDATE':
      const result = {
        application: { ...prev.application, ...applicationEvent.application },
      };
      console.log('UPDATE', result);
      // return applicationEvent.application;
      return result;

    default:
      return prev;
  }
}

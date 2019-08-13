import ServiceInstances from './ServiceInstances/defaults';
import ServiceInstanceDetails from './ServiceInstanceDetails/defaults';
import Filter from './Filter/defaults';
import Notification from './Notification/defaults';

export default {
  ...ServiceInstances,
  ...ServiceInstanceDetails,
  ...Filter,
  ...Notification,
};

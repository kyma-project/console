export const DOCUMENTATION_PER_PLAN_DESCRIPTION = `Every plan comes with a separate API and matching documentation`;
export const DOCUMENTATION_PER_PLAN_LABEL = 'documentation-per-plan';

export const filterExtensions = ['md', 'xml', 'json', 'yml', 'yaml'];
export const createInstanceConstants = {
  buttonText: {
    provisionOnlyOnce: 'Add once',
    provisionOnlyOnceActive: 'Added once',
    standard: 'Add',
  },
  provisionOnlyOnceInfo:
    'You can provision this Service Class only once in a given Namespace.',
};
export const serviceClassConstants = {
  addons: 'Add-Ons',
  addonsDescription:
    'Enrich your experience with additional add-ons which allow you to provision services inside the cluster.',
  addonsTooltipDescription: 'Enrich your experience with additional add-ons',
  emptyListMessage: 'No Service Classes found',
  emptyInstancesListMessage: 'No Service Instances found',
  instancesTabText: 'Instances',
  tableHeaderInstance: 'INSTANCE NAME',
  tableHeaderStatus: 'STATUS',
  services: 'Services',
  servicesDescription:
    'Enrich your experience with additional services that are installed outside the cluster.',
  servicesTooltipDescription: 'Enrich your experience with additional services',
  title: 'Service Catalog',

  noClassText: "Such a Service Class doesn't exist in this Namespace",
  errorServiceClassesList:
    'An error occurred while loading Service Classes List',
  errorServiceClassDetails:
    'An error occurred while loading Service Classes Details',
  errorServiceClassPlansList:
    'An error occurred while loading Service Classes Variants List',

  //service class list tabs indices
  servicesIndex: 0,
  addonsIndex: 1,
};

export const serviceClassTabs = {
  openApi: 'Console',
  asyncApi: 'Events',
  odata: 'OData',
};

export const serviceClassTileTitles = {
  creator: 'Creator',
  lastUpdate: 'Last Update',
  documentation: 'Documentation',
  support: 'Support',
  description: 'Description',
  tags: 'Tags',
  plans: 'Selected plan',
};

export const serviceInstanceConstants = {
  title: 'Service Instances',
  addons: 'Add-Ons',
  addonsTooltipDescription: 'Enrich your experience with additional add-ons',
  services: 'Services',
  servicesTooltipDescription: 'Enrich your experience with additional services',
  instances: 'Instances',

  //service instance info
  classHeader: 'Service Class',
  planHeader: 'Plan',
  documentationHeader: 'Documentation',
  supportHeader: 'Support',
  labelsHeader: 'Labels',
  statusHeader: 'Status',
  instanceDeleteConfirm: 'Are you sure you want to delete instance',
  instanceNotExists: "Service Instance doesn't exist",
  instanceParameters: 'Instance Parameters',
  instanceDeleted:
    'This Service Instance has been deleted and is not available anymore.',
  noDescription: 'No description available',

  //common
  delete: 'Delete',
  cancel: 'Cancel',
  link: 'Link',
  error: 'Error',

  //instance list tabs indices
  servicesIndex: 0,
  addonsIndex: 1,
};

export const serviceInstanceTabs = {
  openApi: 'Console',
  asyncApi: 'Events',
  odata: 'OData',
};

export const bindingVariables = {
  setEnvPrefix:
    'Defines the prefix of environment variables environment variables that the ServiceBindingUsage injects. The prefixing is disabled by default.',
  serviceBinding:
    'To use ServiceInstance, you need credentials for this service. To obtain credentials, proceed with this form. One instance can have numerous credentials to use in the Deployment or Function. When you raise a credentials request, the system returns the credentials in the form of a Secret. The system creates a Secret in a given Environment.',
  serviceBingingUsage:
    "The Secret allows you to run the service successfully. However, a problem appears each time you need to change the definition of the yaml file in the Deployment to specify the Secrets' usage. The manual process of editing the file is tedious and time-consuming. Kyma handles it by offering a custom resource called ServiceBindingUsage. This custom resource applies the Kubernetes PodPreset resource and allows you to enforce an automated flow in which the ServiceBindingUsage controller injects credentials into a given Application or Function.",
};

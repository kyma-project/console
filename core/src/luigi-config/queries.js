export const GET_MICROFRONTENDS = `query MicroFrontends($namespace: String!) {
    microFrontends(namespace: $namespace){
      name
      category
      viewBaseUrl
      navigationNodes{
        label
        navigationPath
        viewUrl
        showInNavigation
        order
        settings
        requiredPermissions{
          verbs
          resource
          apiGroup
        }
      }
    }
  }`;

export const CONSOLE_INIT_DATA = `query {
    selfSubjectRules {
      verbs
      resources
      apiGroups
		}
    backendModules{
      name
    }
    clusterMicroFrontends{
      name
      category
      viewBaseUrl
      preloadUrl
      placement
      navigationNodes{
        label
        navigationPath
        viewUrl
        showInNavigation
        order
        settings
        externalLink
        requiredPermissions{
          verbs
          resource
          apiGroup
        }
      }
    }
  }`;

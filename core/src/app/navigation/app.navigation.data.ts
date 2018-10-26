import { AppConfig } from '../app.config';

export type INavTypes = 'environment' | 'settings';

export const navModel = {
  environment: {
    topEntry: {
      name: 'Workspace',
      link: 'workspace'
    },
    showEnvChooser: true,
    groups: [
      {
        name: 'Overview',
        link: 'details'
      },
      {
        name: 'Service Catalog',
        entries: [
          {
            name: 'Catalog',
            link: 'service-catalog'
          },
          {
            name: 'Instances',
            link: 'instances'
          },
          {
            name: 'Brokers',
            link: 'brokers'
          }
        ]
      },
      {
        name: 'Configuration',
        entries: [
          {
            name: 'APIs',
            link: 'apis'
          },
          {
            name: 'Permissions',
            link: 'permissions'
          },
          {
            name: 'Resources',
            link: 'resources'
          }
        ]
      },
      {
        name: 'Development',
        entries: [
          {
            name: 'Lambdas',
            link: 'lambdas'
          }
        ]
      },
      {
        name: 'Operation',
        entries: [
          {
            name: 'Deployments',
            link: 'deployments'
          },
          {
            name: 'Replica Sets',
            link: 'replicaSets'
          },
          {
            name: 'Pods',
            link: 'pods'
          },
          {
            name: 'Services',
            link: 'services'
          },
          {
            name: 'Secrets',
            link: 'secrets'
          }
        ]
      }
    ]
  },
  settings: {
    topEntry: {
      name: 'General Settings',
      link: 'organisation'
    },
    showEnvChooser: false,
    groups: [
      {
        name: 'Integration',
        entries: [
          {
            name: 'Remote Environments',
            link: 'remoteEnvs'
          },
          {
            name: 'Service Brokers',
            link: 'serviceBrokers'
          },
          {
            name: 'IDP Presets',
            link: 'idpPresets'
          }
        ]
      },
      {
        name: 'Administration',
        entries: [
          {
            name: 'Global Permissions',
            link: 'globalPermissions'
          }
        ]
      },
      {
        name: 'Diagnostics',
        entries: [
          {
            name: 'Stats & Metrics',
            link: `https://grafana.${AppConfig.domain}/`,
            external: true
          },
          {
            name: 'Tracing',
            link: `https://jaeger.${AppConfig.domain}/`,
            external: true
          }
        ]
      }
    ]
  }
};

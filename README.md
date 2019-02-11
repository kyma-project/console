# Console

## Overview

Console is a web-based UI for managing resources within Kyma. It consists of separate front-end applications. Each project is responsible for providing a user interface for particular resource management.

### Components

The Console project consists of the following UI projects:
- [`Core`](./core) - The main frame of Kyma UI
- [`Catalog`](./catalog) - The UI layer for Service Catalog
- [`Instances`](./instances) - The view for displaying Service Instances
- [`Brokers`](./brokers) - The view for displaying Service Brokers
- [`Lambda`](./lambda) - The view for lambda functions
- [`Content`](./content) - The documentation view
- [`Log UI`](./log-ui) - The logs view
- [`Tests`](./tests) - Acceptance and end-to-end tests

Console also includes the libraries with components for the React and Angular front-end frameworks:
- [`React components`](./components/react)
- [`Generic list for Angular`](./components/angular/generic-list)

## Installation

1. Install [Kyma](https://github.com/kyma-project/kyma/blob/master/docs/kyma/docs/04-03-local-installation-from-sources.md) as a backing service for your local instance of Console. Make sure you import certificates into your operating system and mark them as trusted. Otherwise, you cannot access the applications hosted in the `kyma.local` domain.
2. Install Console that uses [Lerna](https://github.com/lerna/lerna) for managing local dependencies. To install all dependencies for all UI projects and prepare symlinks for local packages within this repository that are components for the React and Angular in the [`components`](./components) folder, run the following commands:
    ```
    npm install
    npm run bootstrap
    ```
    **NOTE:** The `npm run bootstrap` command updates your `/etc/hosts` with the `127.0.0.1 console-dev.kyma.local` host.
3. Run the following command to run the Console with [`core`](./core) and all the views locally:
    ```
    npm run start
    ```
4. To access the local instance of the Console at `http://console-dev.kyma.local:4200`, use credentials from [this](https://github.com/kyma-project/kyma/blob/master/docs/kyma/docs/031-gs-local-installation.md#access-the-kyma-console) document.

## Development

Once you start Kyma with Console locally, you can start development. All modules have hot-reload enabled therefore you can edit the code real time and see the changes in your browser.

The `Core` and other UIs run at the following addresses:
- `Core` - [http://console-dev.kyma.local:4200](http://console-dev.kyma.local:4200)
- `Catalog` - [http://console-dev.kyma.local:8000](http://console-dev.kyma.local:8000)
- `Instances` - [http://console-dev.kyma.local:8001](http://console-dev.kyma.local:8001)
- `Brokers` - [http://console-dev.kyma.local:8002](http://console-dev.kyma.local:8002)
- `Lambda` - [http://console-dev.kyma.local:4201](http://console-dev.kyma.local:4201)
- `Content` - [http://console-dev.kyma.local:8003](http://console-dev.kyma.local:8003)

If you want to run only a specific UI, follow the instructions in the appropriate folder.

> **NOTE:** To clear dependencies and remove symlinks, run this command:
> ```
> npm run clean
> ```

### Development with local GraphQL API

By default, the [`core`](./core) and all views are connected to the **GraphQL API** running on the cluster at [this](https://ui-api.kyma.local/graphql) address. If you want to use local **GraphQL API** endpoint, follow the instructions in the **Run a local version** section of [this](https://github.com/kyma-project/kyma/tree/master/components/ui-api-layer#run-a-local-version) document and run the following command:
```
npm run start:api
```

### Run tests

For the information on how to run tests and configure them, go to the [`tests`](tests) directory.

## Troubleshooting

To solve most of the problems with the Console development, clear the browser cache or do a hard refresh of the website.

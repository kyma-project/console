# Console

## Overview

Console is a web-based UI for managing resources within Kyma. It consists of separate front-end applications. Each project is responsible for providing a user interface for particular resource management.

### Components

The Console project consists of the following UI projects:

- [`Core`](./core) - The main frame of Kyma UI
- [`Catalog`](./service-catalog-ui/catalog) - The UI layer for Service Catalog
- [`Instances`](./service-catalog-ui/instances) - The view for displaying Service Instances
- [`Brokers`](./service-catalog-ui/brokers) - The view for displaying Service Brokers
- [`Addons`](./add-ons) - The view for displaying Namespace-scoped and cluster-wide Addons
- [`Lambda`](./lambda) - The view for lambda functions
- [`Content`](./content) - The documentation view
- [`Log UI`](./logging) - The logs view
- [`Compass`](./logging) - The **experimental** view for the [Compass](https://github.com/kyma-incubator/compass/blob/master/README.md) project.
- [`Tests`](./tests) - Acceptance and end-to-end tests

The Console also includes React and Angular libraries:

- [`React common`](./common) - common functionalities for React applications
- [`React components`](./components/react) - components for React applications (it will be replaced by `Shared components`)
- [`Shared components`](./components/shared) - new versions of components for React applications written in TypeScript
- [`Generic documentation`](./components/generic-documentation) - a React component that uses [`@kyma-project/documentation-component`](https://github.com/kyma-incubator/documentation-component) for displaying documentation and various specifications in the [`Content`](./content), [`Catalog`](./service-catalog-ui/catalog) and [`Instances`](./service-catalog-ui/instances) views.

## Prerequisites

- [`npm`](https://www.npmjs.com/): >= 6.4.0

## Installation

1. Install [Kyma](https://kyma-project.io/docs/master/root/kyma/#installation-install-kyma-locally) as a backing service for your local instance of Console. Make sure you import certificates into your operating system and mark them as trusted. Otherwise, you cannot access the applications hosted in the `kyma.local` domain.

2. Install Console dependencies. To install dependencies for the root and all UI projects, and prepare symlinks for local libraries within this repository, run the following command:

    ``` bash
    npm run bootstrap
    ```

    > **NOTE:** The `npm run bootstrap` command:
    > - installs root dependencies provided in the [package.json](./package.json) file
    > - installs dependencies for the [`React common`](./common), [`React components`](./components/react), [`Shared components`](./components/shared) and [`Generic documentation`](./components/generic-documentation) libraries
    > - builds all the libraries
    > - installs dependencies for all the [components](#components)
    > - updates your `/etc/hosts` with the `127.0.0.1 console-dev.kyma.local` host
    > - ignores all `config.js` files in git

## Usage

Use the following command to run the Console with the [`core`](./core) and all other views locally:

``` bash
npm run start
```

To access the local instance of the Console at `http://console-dev.kyma.local:4200`, use credentials from [this](https://kyma-project.io/docs/master/root/kyma#installation-install-kyma-on-a-cluster--provider-installation--aks--access-the-cluster) document - point 3.

If you want to watch changes in the React libraries, run the following command in a new terminal window:

``` bash
npm run watch:libraries
```

## Development

Once you start Kyma with Console locally, you can start development. All modules have hot-reload enabled therefore you can edit the code real time and see the changes in your browser.

The `Core` and other UIs run at the following addresses:

- `Core` - [http://console-dev.kyma.local:4200](http://console-dev.kyma.local:4200)
- `Lambda` - [http://console-dev.kyma.local:4201](http://console-dev.kyma.local:4201)
- `Log UI` - [http://console-dev.kyma.local:4400](http://console-dev.kyma.local:4400)
- `Catalog` - [http://console-dev.kyma.local:8000](http://console-dev.kyma.local:8000)
- `Instances` - [http://console-dev.kyma.local:8001](http://console-dev.kyma.local:8001)
- `Brokers` - [http://console-dev.kyma.local:8002](http://console-dev.kyma.local:8002)
- `Content` - [http://console-dev.kyma.local:8003](http://console-dev.kyma.local:8003)
- `Addons` - [http://console-dev.kyma.local:8004](http://console-dev.kyma.local:8004)

If you want to run only a specific UI, follow the instructions in the appropriate folder.

### Development with local GraphQL API

By default, the [`core`](./core) and all other views are connected to the **GraphQL API** running on the cluster at [this](https://console-backend.kyma.local/graphql) address. If you want to use local **GraphQL API** endpoint, follow the instructions in the **Run a local version** section of [this](https://github.com/kyma-project/kyma/tree/master/components/console-backend-service#run-a-local-version) document and run the following command:

``` bash
npm run start:api
```

### Run tests

For the information on how to run tests and configure them, go to the [`tests`](tests) directory.

## Troubleshooting

> **TIP:** To solve most of the problems with the Console development, clear the browser cache or do a hard refresh of the website.

### CI fails on PRs related to staging dependencies

Remove the `node_modules` folder and the `package-lock.json` file in all libraries in the [`components`](./components) folder and on the root. Then rerun the `npm run bootstrap` command in the root context and push all the changes.

### Can't access `console.kyma.local` and `console-dev.kyma.local:4200` after hibernating the Minikube cluster

Follow the guidelines from [this](https://kyma-project.io/docs/master/root/kyma/#troubleshooting-basic-troubleshooting-can-t-log-in-to-the-console-after-hibernating-the-minikube-cluster) document to solve the problem.

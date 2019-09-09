# Tests

## Overview

This project contains UI acceptance tests for Kyma.

## Prerequisites

To run the `catalog-ui-test`, you need to install Kyma with the `testing` bundle included. For more information about including the `testing` bundle, read [this](https://kyma-project.io/docs/master/components/helm-broker/#details-create-addons-repository) document.

## Installation

To install dependencies, run the `npm install` command.

## Development

Learn how to run all tests or specific ones.

### Run all tests

> **NOTE:** You need a valid `kubeconfig` issued for a user with admin rights for the cluster. On local deployments, the appropriate `kubeconfig` file is set automatically during Minikube setup. For cluster deployments, you must obtain the `kubeconfig` file manually.

To run all acceptance tests inside a container in the cluster, use this command:

``` bash
npm run test:cluster
```

To run all acceptance tests outside the cluster, use this command:

``` bash
npm run test:cluster-outside
```

To run all acceptance tests during development against `http://console-dev.kyma.local:4200`, use this command:

``` bash
npm run test
```

> **NOTE:** In the second case, take note of which **GraphQL API** endpoint you use.

### Run specific tests

By default, the commands from the **Run all tests** section allow you to run all available tests. To run only the selected ones, change the value of the `testRegex` field in the [`package.json`](package.json) file. These are the available tests to run:

- `console-basic-test` for `core` view
- `catalog-ui-test` for `service-catalog` and `instances` views
- `docs-ui-test` for `content` view
- `lambda-ui-test` for `lambda` view
- `logging-test` for `logging` view

# Tests

## Overview

This project contains UI acceptance tests for Kyma.

## Run all tests

If you do not have the dependencies installed through Lerna, use the `npm install` command to install them.

> **NOTE:** You need a valid `kubeconfig` issued for a user with admin rights for the cluster. On local deployments, the appropriate `kubeconfig` file is set automatically during Minikube setup. For cluster deployments, you must obtain the `kubeconfig` file manually.

To run all acceptance tests inside a container in the cluster, use this command:

```
npm run test:cluster
```

To run all acceptance tests outside the cluster, use this command:

```
npm run test:cluster-outside
```

To run all acceptance tests during development against `http://console-dev.kyma.local:4200`, use this command:

```
npm run test
```

> **NOTE:** In the second case, take note of which **GraphQL API** endpoint you use.

## Run specific tests

By default, the commands from the **Run all tests** section allow you to run all available tests. To run only the selected ones, change the value of the `testRegex` field in the [`package.json`](package.json) file. These are the available tests to run:

- `console-basic-test` for `core` view
- `catalog-ui-test` for `service-catalog` and `instances` views
- `docs-ui-test` for `content` view
- `lambda-ui-test` for `lambda` view

# Tests

## Overview

This project contains UI smoke tests for Kyma.

## Installation

To install dependencies, run the `npm install` command.

## Development

To run UI tests inside a container in the cluster using a Chrome browser, use this command:

``` bash
npm run test:cluster
```

To run UI tests on a cluster, use this command:

``` bash
CYPRESS_DOMAIN={YOUR_DOMAIN} CYPRESS_PASSWORD={YOUR_CLUSTER_PASSWORD} npm start
```

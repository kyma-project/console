# Tests

## Overview

This project contains UI smoke tests for Kyma.

## Installation

To install dependencies, run the `npm install` command.

## Development

To run UI tests inside a container in the cluster using a Chromium browser, use this command:

``` bash
npm run test:cluster
```

To run UI tests inside a container in the cluster using Firefox browser, use this command:

``` bash
npm run test:cluster_firefox
```

To run UI tests during development against `http://console-dev.kyma.local:4200`, use this command:

``` bash
npm run test
```

To run UI tests during development against `http://console-dev.kyma.local:4200` using headless browser, use this command:

``` bash
npm run test:headless
```

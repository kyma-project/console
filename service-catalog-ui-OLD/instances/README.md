# Instances UI

## Overview

The project contains an application with the Service Instances page UI for the Kyma Console. The view enables you to list services and provision their instances in the Service Instances.

The [create-react-app](https://github.com/facebook/create-react-app) project provides the structure for this application. Read the project's [README](https://github.com/facebook/create-react-app/tree/next/packages/react-scripts/template) document for more information.

## OSBA Contract

Contract with [OSBA](https://www.openservicebrokerapi.org/) is available in the [Instances view](https://github.com/kyma-project/kyma/tree/master/docs/service-catalog/docs/062-ui-instances.md) document.

## Installation

To install dependencies, run the `npm install` command.

## Usage

This section describes how to build the application, and how to build and publish the image.

### Build the application

Use the following command to build the application in the production environment, in the `build` folder:

```bash
npm run build
```

The command allows you to correctly bundle React in the production mode, and optimize the build for the best performance.

The build is minified and the filenames include hashes.

### Build and run the Docker image

1. Run the following command to build and run the Docker image:

    ``` bash
    sh ../scripts/build-docker-image.sh addons-ui
    docker run --rm -p 8001:80 docs-ui
    ```

2. Open `http://localhost:8001` in a browser.

## Development

Run the `npm start` command to start the application in the development mode.
Open the `[http://localhost:8001](http://localhost:8001)` link to view it in the browser.

The page reloads if you make edits.
If lint errors appear, the console displays them.

## Test the application

Run the `npm test` command to launch the test runner in the interactive watch mode.

See the **Running Tests** section in the Create React App [documentation](https://create-react-app.dev/docs/running-tests) for more information.

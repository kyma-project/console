# Instances UI

## Overview

The project contains an application with the Service Instances page UI for the Kyma Console. The view enables you to list services and provision their instances in the Service Instances.

The [create-react-app](https://github.com/facebook/create-react-app) project provides the structure for this application. Read the project's [README](https://github.com/facebook/create-react-app/tree/next/packages/react-scripts/template) document for more information.

## OSBA Contract

Contract with [OSBA](https://www.openservicebrokerapi.org/) is available in the [OSBAContract.md](OSBAContract.md) file.

## Installation

To install the dependencies, run the `npm install` command.

## Usage

This section describes how to build the application, and to build and publish the image.

### Build an application

Run the `npm run build` command to build the application for production in the `build` folder.
The command allows you to bundle React in the production mode correctly, and optimize the build for the best performance.

The build is minified and the filenames include hashes.

### Build and run a Docker image

Run the following command to build and run the Docker image:

```
sh ../scripts/build-docker-image.sh instances-ui 
docker run --rm -p 3000:80 instances-ui
open http://localhost:3000 or http://localhost:3000/status in a browser
```

## Development

This section describes how to run the application.

### Run the application

Run the `npm start` command to start the application in the development mode.
Open the `[http://localhost:8001](http://localhost:8001)` link to view it in the browser.

The page reloads if you make edits.
If lint errors appear, the console displays them.

### Test the application

Run the `npm test` command to launch the test runner in the interactive watch mode.

See the **Running Tests** section in this [README.md](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-test) file for more information.
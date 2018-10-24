# Docs UI

## Overview

The project contains an application with the Docs UI page for the Kyma Console. The view enables you to list documentation.

The [create-react-app](https://github.com/facebook/create-react-app) project provides the structure for this application. Read the project's [README](https://github.com/facebook/create-react-app/tree/next/packages/react-scripts/template) document for more information.

## Installation

To install the dependencies, run the `npm install` command.

## Usage

This section describes how to build the application, and to build and publish the image.

### Prepare the data for build and start commands

Run the `npm run prepare` command to download or update the list of documentation topics.

### Build an application

Run the `npm run build` command to build the application for production in the `build` folder.
The command allows you to bundle React in the production mode correctly, and optimize the build for the best performance.

The build is minified and the filenames include hashes.

### Build and run a Docker image

Run the following command to build and run the Docker image:

```
sh ../scripts/build-docker-image.sh docs-ui
docker run --rm -p 8002:80 docs-ui
open http://localhost:8002 or http://localhost:8002/status in a browser
```

## Development

This section describes how to run the application.

### Run the application

Run the `npm start` command to start the application in the development mode.
Open the `[http://localhost:8002](http://localhost:8002)` link to view it in the browser.

The page reloads if you make edits.
If lint errors appear, the console displays them.

### Test the application

Run the `npm test` command to launch the test runner in the interactive watch mode.

See the **Running Tests** section in this [README.md](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-test) file for more information.

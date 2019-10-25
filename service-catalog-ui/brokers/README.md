# Brokers UI

## Overview

The project contains an application with the Service Brokers UI page for the Kyma Console. The view enables you to list the Service Brokers.

The [Create React App](https://create-react-app.dev/) project provides the structure for this application. Read the project's [documentation](https://create-react-app.dev/docs/available-scripts) for more information.

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
docker run --rm -p 8002:80 docs-ui
```

2. Open `http://localhost:8002` in a browser.

## Development

Run the `npm start` command to start the application in the development mode.
Open the `[http://localhost:8002](http://localhost:8002)` link to view it in the browser.

The page reloads if you make edits.
If lint errors appear, the console displays them.

## Test the application

Run the `npm test` command to launch the test runner in the interactive watch mode.

See the **Running Tests** section in the Create React App [documentation](https://create-react-app.dev/docs/running-tests) for more information.

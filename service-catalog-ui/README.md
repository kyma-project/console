# Service Catalog UI

## Overview

The project contains 3 applications:
 - Service Brokers UI
 - Service Catalog
 - Service Instances
 which are included in the Kyma Console as micro front-ends.

## Installation

To install the dependencies for all 3 applications, run the `npm install` command.

## Usage

This section describes how to build the application, and how to build and publish the image.

### Build applications

Run the `npm run build` command to build all 3 applications for production in the equivalent `build` folders.
The command allows you to bundle React in the production mode correctly, and to optimize the build for the best performance.

The build is minified and the filenames include hashes.

### Build and run a Docker image

Run the following command to build and run the Docker image:

```
make build-image
```

## Development

This section describes how to run and test the applications.

### Run the applications

Run the `npm start` command to start all 3 applications in the development mode.
Open the `[http://localhost:8000](http://localhost:8000)`, `[http://localhost:8001](http://localhost:8001)`, `[http://localhost:8002](http://localhost:8002) links to view them in the browser.

The page reloads if you make edits.
If lint errors appear, the console displays them.

### Test the applications

Run the `npm test` command to launch the test runner in the interactive watch mode for all 3 applications.

See the **Running Tests** section in this [README.md](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-test) document for more information.

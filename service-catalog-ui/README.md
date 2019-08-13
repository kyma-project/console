# Service Catalog UI

## Overview

The project contains three applications:
- Service Brokers UI
- Service Catalog
- Service Instances
These applications are included in the Kyma Console as micro front-ends.

## Installation

To install dependencies for all three applications, run the `npm install` command.

## Usage

This section describes how to build the applications, and how to build and publish the image.

### Build applications

Run the `npm run build` command to build all three applications for production in the equivalent `build` folders.
The command allows you to bundle React in the production mode correctly, and to optimize the build for the best performance.

The build is minified and the filenames include hashes.

### Build and run a Docker image

Run the following command to build and run the Docker image:

``` bash
make build-image
```

## Development

This section describes how to run and test the applications.

### Run the applications

Run the `npm start` command to start all three applications in the development mode.
Open the [http://localhost:8000](http://localhost:8000), [http://localhost:8001](http://localhost:8001) and [http://localhost:8002](http://localhost:8002) links to view them in the browser.

The page reloads if you make edits.
If lint errors appear, the terminal displays them.

### Test the applications

Run the `npm test` command to launch the test runner in the interactive watch mode for all three applications.

# Kyma React Components

## Overview

This application is a ReactJS component library for the Kyma, based on the [component-library-starter](https://github.com/alanbsmith/component-library-starter).

You can see the components and their properties on the [Console](https://kyma-project.github.io/console) page.

## Usage

To import the library into an application, run the following command:

```bash
npm install --save @kyma-project/react-components
```

## Development

### Build

After the build, the webpack creates the `lib` folder.

Run once:

```bash
npm run build
```

Then run the `watch` script:

```bash
npm run build:watch
```

### Test

**Jest Snapshots** manages all of the testing. **Jest Snapshots** places the tests in the `__tests__` folders, on the component level.

To run the tests once:

```bash
npm test
```

To run the watch script:

```bash
npm run test:watch
```

To view the coverage report:

```bash
npm run test:coverage:report
```

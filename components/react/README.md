### Kyma React Components

## Overview

This application is a ReactJS component library for the Kyma, based on the [component-library-starter](https://github.com/alanbsmith/component-library-starter).

You can see the components and their properties on the [Console](https://kyma-project.github.io/console) page.

## Usage

To import the library into an application, run the following command:

```
npm install --save @kyma-project/react-components
```

## Development

### Build

After the build, the webpack creates the `lib` folder.

Run once:

```
npm run build
```

Then run the `watch` script:

```
npm run build:watch
```

### Live preview

Use [react-styleguidist](https://github.com/styleguidist/react-styleguidist) as a development environment. It lists component propTypes and shows live, editable usage examples based on Markdown files.

To run the live preview:

```
npm run styleguide
```

To build sources for later publication:

```
npm run styleguide:build
```

### Test

**Jest Snapshots** manages all of the testing. **Jest Snapshots** places the tests in the `__tests__` folders, on the component level.

To run the tests once:

```
npm test
```

To run the watch script:

```
npm run test:watch
```

To view the coverage report: 

```
npm run test:coverage:report
```

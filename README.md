# Console
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fkyma-project%2Fconsole.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fkyma-project%2Fconsole?ref=badge_shield)


## Overview

Console is a web-based UI for managing resources within Kyma. It consists of separate front-end applications. Each project is responsible for providing a user interface for particular resource management.

### Components
The Console project consists of the following UI projects:
- [`Core`](./core) - The main frame of Kyma UI
- [`Instances`](./instances) - The view for displaying Service Instances
- [`Catalog`](./catalog) - The UI layer for Service Catalog
- [`Lambda`](./lambda) - The view for lambda functions
- [`Content`](./content) - The documentation view
- [`Tests`](./tests) - Acceptance and end-to-end tests

Console also includes the libraries with components for the React and Angular front-end frameworks:
- [`React components`](./components/react)
- [`Generic list for Angular`](./components/angular/generic-list)

## Usage
This repository uses Lerna for managing local dependencies.

To install all dependencies for all UI projects and prepare symlinks for local packages within this repository, run the following commands:
```
npm install
npm run bootstrap
```

To clear dependencies and remove symlinks, run this command:
```
npm run clean
```


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fkyma-project%2Fconsole.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fkyma-project%2Fconsole?ref=badge_large)
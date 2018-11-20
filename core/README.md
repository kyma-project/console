# Console

## Overview

Console is a web based UI for managing resources within Kyma.
The Kyma installer comes with the console application. Console is installed together with all the Kyma core components.

## Installation

### Install the Kyma

- Clone the [kyma](https://github.com/kyma-project/kyma) repository.
- Read the **Run on local minikube** section of the [README](https://github.com/kyma-project/kyma/blob/master/installation/README.md) file in the `installation` folder.
- Run the `./cmd/run.sh` script as described in the README file.
- Check the status by calling `./scripts/is-installed.sh` script.

Now you can access Console by name from the browser at https://console.kyma.local. A dedicated Docker container serves this application from inside the Kyma cluster.

### Import the TLS cerificate

Kyma comes with a built-in [TLS certificate](https://github.com/kyma-project/kyma/tree/master/installation/certs/workspace/raw) for the `kyma.local` domain. This certificate is self-signed. So web browsers do not trust it by default. To improve your development experience, import this certificate into your operating system and mark it as trusted. Otherwise, you have to accept self-signed certificates explicitly in the browser before you can access the applications hosted in the `kyma.local` domain.


## Development

To simplify development, set up another instance of the Console application served directly from your machine. The following section provides you with a step-by-step guide to set up the Console application for development. Keep Kyma running. You need it as a backing service for your local instance of Console. Follow these steps:

- Clone this repository
- Run `cd core` to change to the `core` directory 
- Run `npm install`
- Run `npm i ng-cli` to install angular CLI
- Update your `/etc/hosts` file to include `127.0.0.1 console-dev.kyma.local`
- Run the command `npm start` to serve the console locally,
- Access the local instance of Console in the browser at `http://console-dev.kyma.local:4200`
- Login to Console as `admin@kyma.cx`


### Code style

Your contributions must match the style guide used in Console. Console uses [Prettier](https://prettier.io) for code formatting. For convenience, [husky](https://github.com/typicode/husky) installs the Git pre-commit hook, so you do not need to perform any additional work. Remember to run `npm install` in the root folder (../) of this repository, to install both tools.

### Console configuration

All the configuration comes from `app.config.ts`.

The console inside the container follows the conventions for helm charts. This means:

- The _console_ sub chart has its own values file, which configures values for the chart templates.
- The parent chart values, in this case, _core_ values, can overwrite those values on the _console_ level.
- Providing those values when calling the helm install command can implicitly overwrite the values.

Now, the Console consumes the resulting values in the application:

- _console_ contains a Kubernetes config map object which consumes the resulting values.
- the Console application mounts this config map as a `config.js` file. Check the `deployment.yaml`.
- this `config.js` file declares an additional clusterConfig object on the window object, and is then consumed in the `app.config.ts` file for overwriting the default values.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build the project

Run `ng build` to build the project. The system stores the build artifacts in the `dist/` directory. Use the `-prod` flag for a production build.

### Run unit tests

Run `ng test` to run the unit tests through [Karma](https://karma-runner.github.io).

### Run ng linter

Run `ng lint` to run the static code quality analysis.


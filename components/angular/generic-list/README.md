# Generic List Component

This is a private package, not published to npm anymore. We use `lerna` to link the build output to the subprojects.

## Development server

Run `npm run serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
You will see a sandbox app that uses <y-generic-table> & <y-generic-list> components from the embedded list.module.ts.

## Build the sandbox app

Run `npm run packagr` to build the project. The built module will be stored in the `dist/` directory and can be linked with lerna. 
Run `npm run packagr-develop` to have automatic rebuild while developing.


# Generic List Component

This is a private package, not published to npm anymore. We use classical symlinks for usage in the components.

## Development server

Run `npm run serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
You will see a sandbox app that uses <y-generic-table> & <y-generic-list> components from the embedded list.module.ts.

## How to use it in a component

Add `--preserve-symlink` option to `ng serve`, `ng test` and `ng build`. 
Add `"include": [ /components/angular/generic-list/src/app/modules/list/**/*.ts" ]` to your component's `tsconfig.json`
Add `"app"` to `tslint.json` if you have the following rules: 

    "no-submodule-imports": [true, "app"],
    "no-implicit-dependencies": [true, ["app"]],


Add a symlink to `components/angular/generic-list/src/app/modules/list` inside your application. 

Example: 
In case of core, we have set the following symlink: 
`core/src/app/generic-list > components/angular/generic-list/src/app/modules/list` and use it in our Angular application with `import { Filter } from 'app/generic-list'`



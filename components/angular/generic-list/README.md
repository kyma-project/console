# Generic List Component

This is a private package, not published to npm anymore. We use symlinks to use it in components.

## Development server

Run `npm run serve` for a development server. Go to `http://localhost:4200/`. The application reloads automatically if you change any of the source files.
You will see a sandbox app that uses <y-generic-table> & <y-generic-list> components from the embedded list.module.ts.

## How to use it in a component

Add `"preserveSymlinks": true` to `angular.json` test and build options. Or alternatively add `--preserve-symlink` option to `ng test` and `ng build`. 
2. Add `"include": [ /components/angular/generic-list/src/app/modules/list/**/*.ts" ]` to  the `tsconfig.json` file of your component.
3. Add `"app"` to  the `tslint.json` file if it includes the following rules: 

    "no-submodule-imports": [true, "app"],
    "no-implicit-dependencies": [true, ["app"]],


Add a symlink to `components/angular/generic-list/src/app/modules/list` inside your application. 

For example: 
Console core has the following symlink set:
`core/src/app/generic-list > components/angular/generic-list/src/app/modules/list` and use it in our Angular application with `import { Filter } from 'app/generic-list'`



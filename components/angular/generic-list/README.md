# Generic List Components

This is a private package, not published to npm anymore. We use symlinks to use it in our Angular microfrontends.

## Development server

Run `npm run serve` for a development server. Go to `http://localhost:4200/`. The application reloads automatically if you change any of the source files.  
A sandbox application appears. It uses `<y-generic-table>` and `<y-generic-list>` components from the embedded `list.module.ts` file.

## How to use it in a component

To use the package in a component, perform the following steps:

1. Run 
    ```bash
    npm install --save fiori-fundamentals fundamental-ngx
    ```
   in your project directory.

2. Add `"preserveSymlinks": true` to `angular.json` test and build options. Alternatively, add `--preserve-symlink` option to `ng test` and `ng build`. 

3. Include 
    ```
    "./node_modules/fiori-fundamentals/dist/fiori-fundamentals.css"
    ```
   in `angular.json` styles array (`projects>your_project>architect>build>styles`).

4. Add `"include": [ /components/angular/generic-list/src/app/modules/list/**/*.ts" ]` to  the `tsconfig.json` file of your component.

5. Add `"app"` to  the `tslint.json` file if it includes the following rules: 

    ````
    "no-submodule-imports": [true, "app"],
    "no-implicit-dependencies": [true, ["app"]],
    ````

6. Add a symlink to `components/angular/generic-list/src/app/modules/list` inside your application.  
For example, the console core has the following symlink set:

    ```
    core/src/app/generic-list > components/angular/generic-list/src/app/modules/list
    ```

7. Use the generic list in `import * as GenericList from 'app/generic-list'` command.
    



# Angular Test Senior

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.0.

## Toms notes

I made the vehicle service (vehicle.service.ts) as requested, but felt that a store would be more suitable for this kind of application. And it would be an excuse to show my skills. So additionally I created the vehicle store (vehicle.store.ts) using signalStore to handle data accross the application.

Given more time I would have liked to have added the following:
- More unit testing. I added a couple in there but a full suite of unit tests would obviously be required given the time.
- Specialised components. Reusable button, input etc. Rather than repeating the styling throughout the app. It would keep the design consistant and made future additions faster/easier.
- Themes. A dark mode would have been a nice addition. I already added in variables for the colours and I was planning on doing something using the new CSS conditional statements, but wanted to focus on the actual test itself before I got too fancy with it :)
- Linting. I was experiencing a weird conflict with the version of NgRx that I had to use and ESlint. I was forced to use NgRx 19 (I believe a version for Angular 20 is yet to be released) and ESLint did not like it at all.

Additional to this, you may need to run `npm install` with `--legacy-peer-deps` to install NgRx.

`VehicleDataService` has been given a 1500ms delay to simulate loading and allow the state to be shown.

## Test instructions
Please refer to the [test instructions readme file](https://github.com/cox-auto-inc-codeweavers/angular-test-senior/blob/main/Tech-Test-Senior-Frontend.md).


## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

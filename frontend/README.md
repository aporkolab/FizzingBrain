# FizzingBrain frontend

Angular 22 application (standalone components, esbuild application builder). See the main [README](../README.md) for the full setup.

## Development server

Run `npx ng serve` for a dev server and open `http://localhost:4200/`. The API URL is configured in `src/environments/`.

## Build

Run `npm run build`. The production build is written to `dist/fizzing-brain/`; `npm start` serves it.

## Running unit tests

Run `npm test` to execute the unit tests once with [Vitest](https://vitest.dev) through the Angular CLI (`ng test`). Use `npx ng test --watch` for watch mode.

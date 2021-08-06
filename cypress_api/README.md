# mark_beaman_TL

## Installation
```
Install Node: https://nodejs.org/en/download/
```

## Project Setup
In terminal, navigate to project root folder, then type:
```
npm install
```

## Run your end-to-end tests
```
npm run cypress-open
```
execute tests via GUI and select 1 or many tests to run
```
npm run cypress-run -- --spec tests/integration/v1/*.js
```
execute tests (run in background) runs all v1 api tests
```
npm run cypress-run -- --spec tests/integration/rate_limiter.js
```
execute tests (run in background) runs only rate limiter (more info in Issues section)

## Lints and fixes files
```
npm run lint
```

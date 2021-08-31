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
npm run cypress-run
```
execute tests (run in background)

## Lints and fixes files
```
npm run lint
```

## VS Code Setup for Cucumber assistence

### Cucumber (Gherkin) Full Support

- Create Folder called `.vscode`

- Add file called `settings.json`

- Within `settings.json` add:
```

{
  "cucumberautocomplete.steps": ["cypress/integration/step_definitions/*.ts"],
  "cucumberautocomplete.syncfeatures": "cypress/integration/*.feature",
  "cucumberautocomplete.strictGherkinCompletion": false,
  "cucumberautocomplete.smartSnippets": true,
  "cucumberautocomplete.stepsInvariants": true
}
```
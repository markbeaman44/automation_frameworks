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
npm run test:open
```
execute tests via GUI
```
npm run test:run
```
execute tests (run in background)
```
npm run test:test
```
execute chosen test against tags via GUI

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
  "cucumberautocomplete.steps": ["tests/e2e/step_definitions/*.ts"],
  "cucumberautocomplete.syncfeatures": "tests/e2e/*.feature",
  "cucumberautocomplete.strictGherkinCompletion": false,
  "cucumberautocomplete.smartSnippets": true,
  "cucumberautocomplete.stepsInvariants": true
}
```

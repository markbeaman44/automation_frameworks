## README Template

Each framework should have a comprehensive README:

```markdown
# [Framework Name] - [Testing Type] Framework

## Description
Brief description of what this framework tests and the tools used.

## Tech Stack
- [Tool 1] - vX.X.X
- [Tool 2] - vX.X.X
- TypeScript - v5.X.X

## Prerequisites
- Node.js v18+ (or Python 3.10+)
- npm or yarn (or pip)
- [Any other requirements]

## Installation

### Install Dependencies
\`\`\`bash
npm install
# or
pip install -r requirements.txt
\`\`\`

## Project Structure
\`\`\`
framework_name/
├── tests/
│   ├── e2e/ - End-to-end test files
│   ├── pages/ - Page Object Model files
│   └── support/ - Helper functions and constants
├── config files
└── README.md
\`\`\`

## Running Tests

### Run All Tests
\`\`\`bash
npm test
\`\`\`

### Run Specific Test
\`\`\`bash
npm test -- --spec "path/to/test"
\`\`\`

### Run with Different Browser
\`\`\`bash
npm run test:chrome
npm run test:firefox
\`\`\`

### Run in Headed Mode
\`\`\`bash
npm run test:headed
\`\`\`

## Linting and Formatting

### Run Linter
\`\`\`bash
npm run lint
\`\`\`

### Format Code
\`\`\`bash
npm run format
\`\`\`

## VS Code Cucumber Autocomplete (for Cucumber projects)

Add this to your `.vscode/settings.json`:

\`\`\`json
{
  "cucumberautocomplete.steps": ["tests/e2e/step_definitions/*.ts"],
  "cucumberautocomplete.syncfeatures": "tests/e2e/*.feature",
  "cucumberautocomplete.strictGherkinCompletion": false,
  "cucumberautocomplete.smartSnippets": true,
  "cucumberautocomplete.stepsInvariants": true
}
\`\`\`

## CI/CD Integration

Example GitHub Actions workflow:

\`\`\`yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm test
\`\`\`

## Troubleshooting

Common issues and solutions...

## Contributing

Guidelines for contributing...
```

## VS Code Settings for Cucumber

Always include VS Code Cucumber autocomplete configuration in README:

```json
{
  "cucumberautocomplete.steps": ["tests/e2e/step_definitions/*.ts"],
  "cucumberautocomplete.syncfeatures": "tests/e2e/*.feature",
  "cucumberautocomplete.strictGherkinCompletion": false,
  "cucumberautocomplete.smartSnippets": true,
  "cucumberautocomplete.stepsInvariants": true
}
```

## Docker Support

For Python projects, include Docker support:

**Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["pytest", "tests/"]
```

**docker-compose.yaml:**
```yaml
version: '3.8'
services:
  test:
    build: .
    volumes:
      - .:/app
    env_file:
      - docker-compose.env
```

**Makefile:**
```makefile
.PHONY: build run test clean

build:
	docker-compose build

run:
	docker-compose up

test:
	docker-compose run test pytest tests/

clean:
	docker-compose down -v
```

## Git Ignore Template

Standard `.gitignore` for test frameworks:

```
# Dependencies
node_modules/
venv/
.env
*.env
!docker-compose.env

# Test Results
test-results/
reports/
screenshots/
videos/
coverage/
.pytest_cache/
__pycache__/
*.pyc

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*

# Build
dist/
build/
*.tsbuildinfo
```


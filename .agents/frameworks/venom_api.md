# Venom API Testing Guidelines

## Stack
- Venom

## Directory Structure
- Follow standard Venom YAML test structure
- Use tests/ directory for test definition files (`.yml`)

## File Naming
- Test files: `test_*.yml`

## Key Patterns
- Utilize venom variables and json assertions `ShouldContain` or `ShouldEqual`
- Assert status codes using `result.statuscode`

## Installation
```
Install Node: https://nodejs.org/en/download/
```

## Project Setup
In terminal, navigate to project root folder, then type:
```
npm install
```

## Playwright MCP Server Setup

To connect this MCP server to your editor (e.g., Antigravity, Cursor, etc.), add the following configuration to your `mcp_config.json` file. This file is typically located at the root of your workspace or managed via your editor's "Manage MCP Servers" interface.

**`mcp_config.json`**:

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "timeout": 30,
      "args": [
        "-y",
        "@playwright/mcp@latest"
      ],
      "cwd": "./mcp_playwright",
      "disabled": false
    }
  }
}
```

### Notes
- The configuration above uses `npx` to run the latest version of the Playwright MCP server on demand.
- This allows the server to run without needing to manually start it every time.
- A config file is included in this directory: `playwright.config.ts` due to chrome popup issues when running in any mode.

## Running the Manual Test Case

We have created a sample "Agent Task" that you can feed to your AI assistant to verify the setup.

1.  Open the file `MANUAL_TEST_CASE.md`.
2.  Go to AI chat.
3.  Say something like: 
    > "Using the Playwright MCP tools, please execute the test case described in MANUAL_TEST_CASE.md"

The agent should then launch a browser (headless or visible depending on config), interact with the site, and report back the results.

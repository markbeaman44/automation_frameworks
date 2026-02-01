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

### Connecting in Antigravity

To connect to a custom MCP server in Antigravity:

1. Open the **MCP store** via the **"..."** dropdown at the top of the editor's agent panel.
2. Click on **"Manage MCP Servers"**.
3. Click on **"View raw config"**.
4. Modify the `mcp_config.json` with your custom MCP server configuration:
5. Replace `{{HOME_PATH_TO_REPO_INSERT_HERE}}` with the path to your local repository.
   - Go to playwright-mcp.config.json, right-click on the file, and select "Copy path".

```json
{
  "mcpServers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "timeout": 30,
      "args": [
        "-y",
        "@playwright/mcp@latest",
        "--config={{HOME_PATH_TO_REPO_INSERT_HERE}}/playwright-mcp.config.json"
      ],
      "disabled": false
    }
  }
}
```

### Notes
- The configuration above uses `npx` to run the latest version of the Playwright MCP server on demand.
- This allows the server to run without needing to manually start it every time.

## Running the Manual Test Case

We have created a sample "Agent Task" that you can feed to your AI assistant to verify the setup.

1.  Add test scenario(s) to the file `TEST_SCENARIOS.md`.
2.  Go to AI/Agent chat in Antigravity.
3.  Say something like: 
    > "Using the Playwright MCP tools, please execute the test case described in TEST_SCENARIOS.md"
    
    > "Using the Playwright MCP tools, please execute the test case described in TEST_SCENARIOS.md - only Scenario 1"

The agent should then launch a browser (headless or visible depending on config), interact with the site, and report back the results.

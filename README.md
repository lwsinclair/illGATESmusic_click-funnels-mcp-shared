# ClickFunnels MCP Framework

This is a Model Context Protocol (MCP) server for integrating ClickFunnels with Claude Desktop.

## Setup Instructions

1. Clone this repository:
```bash
git clone https://github.com/illGATESmusic/click-funnels-mcp-shared.git
cd click-funnels-mcp-shared
```

2. Install dependencies:
```bash
npm install
```

3. Update the `.env` file with your ClickFunnels API credentials:
```
PORT=3002
CLICKFUNNELS_API_BASE=https://your-domain.myclickfunnels.com/api/v2
CLICKFUNNELS_WORKSPACE_ID=123456
CLICKFUNNELS_API_TOKEN=YOUR_API_TOKEN_HERE
CLICKFUNNELS_WORKSPACE_SUBDOMAIN=your-subdomain
NODE_ENV=production
```

4. Build the project:
```bash
npm run build
```

5. Update your Claude Desktop config:

Edit your Claude Desktop config file (located at `~/Library/Application Support/Claude/claude_desktop_config.json` on Mac or appropriate location for your OS) to include this server:

```json
{
  "mcpServers": {
    "clickfunnels-mcp-framework": {
      "command": "node",
      "args": ["/absolute/path/to/click-funnels-mcp-shared/dist/index.js"],
      "env": {
        "PORT": "3002",
        "CLICKFUNNELS_API_BASE": "https://your-domain.myclickfunnels.com/api/v2",
        "CLICKFUNNELS_WORKSPACE_ID": "123456",
        "CLICKFUNNELS_API_TOKEN": "YOUR_API_TOKEN_HERE",
        "CLICKFUNNELS_WORKSPACE_SUBDOMAIN": "your-subdomain",
        "NODE_ENV": "production",
        "MCP_LOG_LEVEL": "debug",
        "MCP_LOG_TO_CONSOLE": "true",
        "MCP_LOG_TO_FILE": "true",
        "MCP_LOG_DIR": "/absolute/path/to/click-funnels-mcp-shared/logs",
        "NODE_OPTIONS": "--max-old-space-size=256"
      },
      "cwd": "/absolute/path/to/click-funnels-mcp-shared"
    }
  },
  "mcpServerConnections": [
    {
      "url": "http://localhost:3002/sse"
    }
  ]
}
```

6. Restart Claude Desktop to apply the changes.

## Troubleshooting

If you encounter any issues, check the logs at:
- `/Users/username/Library/Logs/Claude/mcp-server-clickfunnels-mcp-framework.log`

Common issues:

1. **"No such file or directory" error:**
   - Make sure all required directories exist (logs, tools, prompts, resources)
   - Ensure the path in `claude_desktop_config.json` matches the absolute path to your server
   - The "cwd" field in the configuration is critical for proper path resolution

2. **Server disconnects immediately:**
   - Check that you're using the correct server name in the configuration
   - Verify all environment variables are correctly set
   - Make sure logs directory exists and is writable

3. **API connection errors:**
   - Verify your ClickFunnels API credentials are correct
   - Check if you've reached any API rate limits

If all else fails, run the `TROUBLESHOOTING.md` script to collect diagnostic information.

## Available Tools

This MCP server provides the following tools:

- `debug` - Provides debugging information about the current environment
- `list_funnels` - Lists all funnels from your ClickFunnels account
- `get_funnel` - Gets a specific funnel by ID
- `list_contacts` - Lists contacts from your ClickFunnels account

## Contributing

If you encounter any issues or have suggestions, please open an issue or submit a pull request.

## License

MIT

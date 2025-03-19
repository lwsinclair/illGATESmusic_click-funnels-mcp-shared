#!/bin/bash
# ClickFunnels MCP Server Troubleshooting Guide

# Common Issue 1: LOG_DIR Error (ENOENT)
# If you see error: "Error: ENOENT: no such file or directory, open 'logs/mcp-server-[DATE].log'"
# Solution: Make sure logs directory exists and absolute path is correct

echo "=== ClickFunnels MCP Troubleshooting ==="
echo ""
echo "1. Checking for required directories..."
REQUIRED_DIRS=("logs" "tools" "prompts" "resources")
for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "✅ $dir directory exists"
  else
    echo "❌ $dir directory missing - creating it now"
    mkdir -p "$dir"
    touch "$dir/.gitkeep"
  fi
done

echo ""
echo "2. Checking for running processes on port 3002..."
if command -v lsof &> /dev/null; then
  lsof -i :3002 || echo "No processes found on port 3002"
else
  echo "lsof command not available"
fi

echo ""
echo "3. Checking environment variables in .env..."
if [ -f ".env" ]; then
  echo "✅ .env file exists"
  if grep -q "CLICKFUNNELS_API_TOKEN" .env; then
    echo "✅ API token is set in .env"
  else
    echo "❌ API token is missing from .env"
  fi
else
  echo "❌ .env file is missing"
fi

echo ""
echo "4. Checking Claude Desktop config..."
CONFIG_FILE="$HOME/Library/Application Support/Claude/claude_desktop_config.json"
if [ -f "$CONFIG_FILE" ]; then
  echo "✅ Claude config file exists"
  if grep -q "clickfunnels-mcp-framework" "$CONFIG_FILE"; then
    echo "✅ ClickFunnels MCP Server is configured"
    # Extract server name from config
    SERVER_NAME=$(grep -o '"[^"]*-framework"' "$CONFIG_FILE" | tr -d '"')
    echo "   Server name in config: $SERVER_NAME"
    # Extract cwd from config 
    CWD=$(grep -A1 "cwd" "$CONFIG_FILE" | grep -o '"/[^"]*"' | head -1 | tr -d '"')
    echo "   Working directory in config: $CWD"
    # Check if working directory exists
    if [ -d "$CWD" ]; then
      echo "✅ Working directory exists"
    else
      echo "❌ Working directory does not exist"
    fi
  else
    echo "❌ ClickFunnels MCP Server is not configured in Claude Desktop"
  fi
else
  echo "❌ Claude config file not found"
fi

echo ""
echo "5. Checking MCP logs..."
LOG_DIR="$HOME/Library/Logs/Claude"
if [ -d "$LOG_DIR" ]; then
  echo "✅ Claude logs directory exists"
  # Look for ClickFunnels MCP log files
  if ls "$LOG_DIR"/mcp-server-*framework*.log 1> /dev/null 2>&1; then
    echo "✅ MCP log files found:"
    ls -la "$LOG_DIR"/mcp-server-*framework*.log
    # Show last 10 lines of the most recent log file
    LATEST_LOG=$(ls -t "$LOG_DIR"/mcp-server-*framework*.log | head -1)
    echo ""
    echo "Last 10 lines of most recent log file:"
    tail -10 "$LATEST_LOG"
  else
    echo "❌ No MCP log files found"
  fi
else
  echo "❌ Claude logs directory not found"
fi

echo ""
echo "6. Common solutions to try:"
echo "• Restart Claude Desktop"
echo "• Make sure server name matches in both index.ts and claude_desktop_config.json"
echo "• Use absolute paths for logs directory in both .env and claude_desktop_config.json"
echo "• Make sure 'cwd' field is set correctly in claude_desktop_config.json"
echo "• Add console.error() statements to your server code for better debugging"
echo "• Kill any existing Node.js processes: 'pkill -f \"node dist/index.js\"'"

echo ""
echo "=== Troubleshooting Complete ===" 
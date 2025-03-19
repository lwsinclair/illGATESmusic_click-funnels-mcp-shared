import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface DebugInput {
  message: string;
}

class DebugTool extends MCPTool<DebugInput> {
  name = "debug";
  description = "A debugging tool that returns information about the environment and echoes the provided message";

  schema = {
    message: {
      type: z.string(),
      description: "Message to echo back in the debug output",
    },
  };

  async execute(input: DebugInput) {
    const env = {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      PORT: process.env.PORT || 'not set',
      CLICKFUNNELS_API_BASE: process.env.CLICKFUNNELS_API_BASE || 'not set',
      CLICKFUNNELS_WORKSPACE_ID: process.env.CLICKFUNNELS_WORKSPACE_ID || 'not set',
      CLICKFUNNELS_WORKSPACE_SUBDOMAIN: process.env.CLICKFUNNELS_WORKSPACE_SUBDOMAIN || 'not set',
      API_TOKEN_STATUS: process.env.CLICKFUNNELS_API_TOKEN ? 'set' : 'not set'
    };

    return {
      message: `Debug message: ${input.message}`,
      timestamp: new Date().toISOString(),
      environment: env,
      process: {
        version: process.version,
        platform: process.platform,
        arch: process.arch,
        pid: process.pid,
        cwd: process.cwd()
      }
    };
  }
}

export default DebugTool;
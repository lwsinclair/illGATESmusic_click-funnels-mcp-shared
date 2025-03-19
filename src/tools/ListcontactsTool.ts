import { MCPTool } from "mcp-framework";
import { z } from "zod";
import axios from "axios";

interface ListContactsInput {
  limit?: number;
  search?: string;
}

class ListcontactsTool extends MCPTool<ListContactsInput> {
  name = "listContacts";
  description = "List contacts in the ClickFunnels workspace with optional search and limit";

  schema = {
    limit: {
      type: z.number().optional(),
      description: "Maximum number of contacts to return (optional)",
    },
    search: {
      type: z.string().optional(),
      description: "Search term to filter contacts (optional)",
    }
  };

  async execute(input: ListContactsInput) {
    try {
      const apiBase = process.env.CLICKFUNNELS_API_BASE;
      const workspaceId = process.env.CLICKFUNNELS_WORKSPACE_ID;
      const apiToken = process.env.CLICKFUNNELS_API_TOKEN;

      if (!apiBase || !workspaceId || !apiToken) {
        throw new Error("Missing required environment variables for ClickFunnels API");
      }

      const params: Record<string, string> = {};
      if (input.limit) {
        params.limit = input.limit.toString();
      }
      if (input.search) {
        params.search = input.search;
      }

      const response = await axios.get(
        `${apiBase}/workspaces/${workspaceId}/contacts`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.error || error.message;
        
        return {
          error: true,
          status: statusCode || 500,
          message: `Error listing contacts: ${errorMessage}`,
        };
      }
      
      return {
        error: true,
        message: `Error listing contacts: ${(error as Error).message}`,
      };
    }
  }
}

export default ListcontactsTool;
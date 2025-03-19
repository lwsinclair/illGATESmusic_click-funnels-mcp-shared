import { MCPTool } from "mcp-framework";
import { z } from "zod";
import axios from "axios";
class ListfunnelsTool extends MCPTool {
    name = "listFunnels";
    description = "List all available funnels in the ClickFunnels workspace";
    schema = {
        limit: {
            type: z.number().optional(),
            description: "Maximum number of funnels to return (optional)",
        },
    };
    async execute(input) {
        try {
            const apiBase = process.env.CLICKFUNNELS_API_BASE;
            const workspaceId = process.env.CLICKFUNNELS_WORKSPACE_ID;
            const apiToken = process.env.CLICKFUNNELS_API_TOKEN;
            if (!apiBase || !workspaceId || !apiToken) {
                throw new Error("Missing required environment variables for ClickFunnels API");
            }
            const params = {};
            if (input.limit) {
                params.limit = input.limit.toString();
            }
            const response = await axios.get(`${apiBase}/workspaces/${workspaceId}/funnels`, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                params
            });
            return response.data;
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                const statusCode = error.response?.status;
                const errorMessage = error.response?.data?.error || error.message;
                return {
                    error: true,
                    status: statusCode || 500,
                    message: `Error listing funnels: ${errorMessage}`,
                };
            }
            return {
                error: true,
                message: `Error listing funnels: ${error.message}`,
            };
        }
    }
}
export default ListfunnelsTool;

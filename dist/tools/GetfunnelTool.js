import { MCPTool } from "mcp-framework";
import { z } from "zod";
import axios from "axios";
class GetfunnelTool extends MCPTool {
    name = "getFunnel";
    description = "Get detailed information about a specific ClickFunnels funnel by ID";
    schema = {
        id: {
            type: z.string(),
            description: "ID of the funnel to retrieve",
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
            const response = await axios.get(`${apiBase}/workspaces/${workspaceId}/funnels/${input.id}`, {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
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
                    message: `Error fetching funnel: ${errorMessage}`,
                };
            }
            return {
                error: true,
                message: `Error fetching funnel: ${error.message}`,
            };
        }
    }
}
export default GetfunnelTool;

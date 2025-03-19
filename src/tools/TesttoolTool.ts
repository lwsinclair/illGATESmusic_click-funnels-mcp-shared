import { MCPTool } from "mcp-framework";
import { z } from "zod";

interface TesttoolInput {
  testString?: string;
}

class TesttoolTool extends MCPTool<TesttoolInput> {
  name = "testtool";
  description = "A simple test tool that always succeeds and returns a confirmation message";

  schema = {
    testString: {
      type: z.string().optional(),
      description: "Optional test string to echo back",
    },
  };

  async execute(input: TesttoolInput) {
    const testString = input.testString || "No test string provided";
    
    return {
      success: true,
      message: "Test completed successfully",
      input: testString,
      timestamp: new Date().toISOString()
    };
  }
}

export default TesttoolTool;
import asyncio
from fastmcp import Client

async def main():
    # Connect to our MCP server
    async with Client("http://localhost:8002/mcp") as client:
        # Get available tools
        tools = await client.list_tools()
        print(f"Available tools: {[tool.name for tool in tools]}")
        
        # Call the calculate_storage tool
        result = await client.call_tool(
            "calculate_storage", 
            {"size_tb": 100, "load_level": "средняя"}
        )
        print("\nCalculation result:")
        print(result[0].text)  # Print the response text

if __name__ == "__main__":
    asyncio.run(main()) 
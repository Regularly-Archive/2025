REASONING_PROMPT_TEMPLATE = """
Generate the next reasoning step to resolve the question through contextual analysis and tool usage:

[Rules]
* If the context directly answers the question with >95% confidence, set continue=false
* Tool parameters must strictly match the data types defined in tool schemas
* Terminate the process if 3 consecutive tool calls fail to advance reasoning
* Always maintain valid JSON syntax (no comments, double quotes only)
* Never invent non-existent tools
* The language used during the reasoning process should remain consistent with the language in which the user posed the question.

[Current Context]
{context}

[Current Question] 
{question}

[Available Tools]
{tools_schema}

Return a valid JSON object following this structure:
{{
    "reasoning": "Brief rationale for this step (1-2 sentences)",
    "requires_tool": true/false,
    "tool_usage": {{"name":"tool_name", "params":{{key:value}}}} || null,
    "result": "Conclusion from this step",
    "confidence": 0-100, // Numerical estimate of result certainty
    "continue": true/false
}}

Examples:
// Knowledge query
{{
    "reasoning": "The question requires historical data about WWII casualties",
    "requires_tool": true,
    "tool_usage": {{"name": "wikipedia_api", "params": {{"topic": "World War II casualties"}}}},
    "result": "Attempting to retrieve casualty statistics",
    "confidence": 75,
    "continue": true
}}

// Final answer
{{
    "reasoning": "Context contains definitive population data from 2023 report",
    "requires_tool": false,
    "tool_usage": null,
    "result": "China's population: 1.411 billion",
    "confidence": 98,
    "continue": false
}}
"""
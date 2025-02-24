REASONING_PROMPT_TEMPLATE = """
[Task]
Generate the next reasoning step to resolve the question through contextual analysis and tool usage.

[Rules]
* If the context answers the question with >95% confidence, set continue=false.
* If the LLM answers the question with >95% confidence, set continue=false.
* Tool parameters must strictly match the data types defined in tool schemas.
* Terminate the process if 3 consecutive tool calls fail to advance reasoning.
* Always maintain valid JSON syntax (no comments, double quotes only).
* Never invent non-existent tools.
* Use the same language as the user's question throughout the reasoning process.
* Do not generate duplicate reasoning steps if they have been shown in previous context.

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


FALLBACK_PROMPT_TEMPLATE="""
[Task]
Generate an accurate and relevant response to the question based on the provided context.

[Current Context]
{context}

[Current Question] 
{question}

[Instructions]
* Carefully analyze the context to identify relevant information..
* Ensure the response directly addresses the question.
* Keep the response concise and clear.
* If the context lacks sufficient information, state that the answer cannot be determined from the given context.

[Current Answer]
"""
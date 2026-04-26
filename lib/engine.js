import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * The core Errorly Engine.
 * It takes a traceback and a set of file contents to generate a context-aware fix.
 */
export async function analyzeTraceback(traceback, projectFiles) {
  const fileContextString = projectFiles
    .map(file => `--- FILE: ${file.path} ---\n${file.content}`)
    .join('\n\n');

  const prompt = `
You are Errorly, an expert Python debugging agent. Your goal is to find and explain the root cause of a Python error using the provided traceback and codebase context.

### CONTEXT GAP ANALYSIS RULES:
1.  **CITE LINE NUMBERS**: You must reference specific line numbers in the provided files for every claim you make.
2.  **MAP PROJECT STRUCTURE**: Explain how different files interact (e.g., "File A imports File B, which then tries to import File A").
3.  **BEYOND THE SYNTAX**: Look for configuration issues (.env, settings.py), circular imports, or dependency mismatches.
4.  **VERIFIABLE FIX**: Provide a specific code change that resolves the error.

### INPUT DATA:
**TRACEBACK**:
${traceback}

**PROJECT CODEBASE**:
${fileContextString}

### RESPONSE FORMAT:
1. **Root Cause Analysis**: Explain *why* the error is happening, citing the project structure and specific lines.
2. **The "Context Gap"**: What did a generic AI or standard traceback miss?
3. **Verifiable Fix**: 
\`\`\`python
# [File Path]
# [Fixed Code Snippet]
\`\`\`
4. **Next Steps**: Any architectural changes to prevent this.
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: 'You are a surgical Python debugging assistant. You provide concise, data-driven analysis based strictly on the provided codebase context.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.1, // Keep it deterministic for debugging
  });

  return response.choices[0].message.content;
}

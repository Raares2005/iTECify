import asyncHandler from 'express-async-handler'

export const generateInlineSuggestion = asyncHandler(async (req, res) => {
  const {
    prompt,
    selectedText,
    beforeContext,
    afterContext,
    fileName,
    language,
  } = req.body

  if (!prompt) {
    res.status(400)
    throw new Error('Prompt is required')
  }

  const finalPrompt = `
You are helping inside a collaborative code editor.

Task:
${prompt}

Rules:
- Return only the code or text that should be inserted
- Keep the same language
- Preserve behavior unless the task explicitly asks to change it
- Do not wrap the answer in markdown fences

File name: ${fileName || 'unknown'}
Language: ${language || 'unknown'}

Selected text:
${selectedText || ''}

Context before:
${beforeContext || ''}

Context after:
${afterContext || ''}
`

  // call your AI provider here
  // const suggestion = await callYourAiProvider(finalPrompt)

  const suggestion = `// demo AI output`

  res.json({ suggestion })
})
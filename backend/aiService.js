import axios from 'axios'

export async function generateInlineAiSuggestion(payload) {
  const { data } = await axios.post('/api/ai/inline', payload)
  return data
}
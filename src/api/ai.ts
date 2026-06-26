export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function streamChat(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
) {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  const baseUrl = import.meta.env.VITE_DEEPSEEK_BASE_URL

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        stream: true
      })
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}))
      throw new Error(errData.error?.message || `请求失败: ${response.status}`)
    }
    if (!response.body) throw new Error('浏览器不支持流式读取')

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    async function read() {
      const { done, value } = await reader.read()
      if (done) { onDone(); return }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || !trimmed.startsWith('data: ')) continue
        const data = trimmed.slice(6)
        if (data === '[DONE]') { onDone(); return }
        try {
          const parsed = JSON.parse(data)
          const text = parsed.choices[0]?.delta?.content || ''
          if (text) onChunk(text)
        } catch { /* 跳过解析失败的行 */ }
      }
      await read()
    }
    await read()
  } catch (err: any) {
    onError(err)
  }
}
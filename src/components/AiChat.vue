<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { streamChat, type ChatMessage } from '@/api/ai'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const visible = ref(false)
const input = ref('')
const messages = ref<Message[]>([])
const loading = ref(false)
const chatBody = ref<HTMLDivElement>()

const scrollToBottom = async () => {
  await nextTick()
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}

const send = async () => {
  const text = input.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  await scrollToBottom()

  messages.value.push({ role: 'assistant', content: '' })
  loading.value = true

  const context: ChatMessage[] = [
    { role: 'system', content: '你是一个友好的AI助手，用中文简洁回答问题，不超过200字。' },
    ...messages.value.slice(0, -1).map(m => ({
      role: m.role,
      content: m.content
    }))
  ]

  streamChat(
    context,
    (chunk) => {
      const last = messages.value[messages.value.length - 1]
      if (last) last.content += chunk
      scrollToBottom()
    },
    () => { loading.value = false },
    (err) => {
      const last = messages.value[messages.value.length - 1]
      if (last) last.content = `❌ ${err.message}`
      loading.value = false
    }
  )
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}

watch(visible, (val) => {
  if (!val) { messages.value = []; input.value = '' }
})
</script>

<template>
  <!-- 悬浮按钮 -->
  <div
    v-if="!visible"
    @click="visible = true"
    style="position: fixed; right: 24px; bottom: 24px; width: 56px; height: 56px; background: linear-gradient(135deg, #4d6bfe, #34a853, #fbbc05, #ea4335); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.2); z-index: 999; font-size: 24px;"
  >
    🤖
  </div>

  <!-- 对话框 -->
  <div
    v-if="visible"
    style="position: fixed; right: 24px; bottom: 24px; width: 420px; height: 540px; background: white; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.2); display: flex; flex-direction: column; z-index: 1000; overflow: hidden;"
  >
    <div style="padding: 12px 16px; background: linear-gradient(135deg, #4d6bfe, #34a853); color: white; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-weight: bold;">你好！我是 AI 助手</span>
      <span @click="visible = false" style="cursor: pointer; font-size: 18px;">✕</span>
    </div>

    <div ref="chatBody" style="flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: #f9fafb;">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        :style="{
          alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
          background: msg.role === 'user' ? '#4d6bfe' : 'white',
          color: msg.role === 'user' ? 'white' : '#333',
          padding: '10px 14px', borderRadius: '12px',
          maxWidth: '80%', whiteSpace: 'pre-wrap',
          wordBreak: 'break-word', fontSize: '14px',
          lineHeight: '1.6', boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }"
      >
        {{ msg.content }}
        <span
          v-if="loading && i === messages.length - 1 && msg.role === 'assistant'"
          style="display: inline-block; width: 4px; height: 16px; background: #4d6bfe; animation: blink 0.8s infinite; vertical-align: middle; margin-left: 2px;"
        />
      </div>

      <div v-if="messages.length === 0" style="text-align: center; color: #999; margin-top: 80px;">
        <p style="font-size: 56px; margin: 0;">🤖</p>
        <p style="margin-top: 12px;">你好！我是 AI 助手</p>
        <p style="font-size: 13px; color: #bbb;">可以问我任何问题</p>
      </div>
    </div>

    <div style="padding: 12px; border-top: 1px solid #eee; display: flex; gap: 8px; background: white;">
      <textarea
        v-model="input"
        :disabled="loading"
        @keydown="onKeydown"
        placeholder="输入问题，Enter 发送..."
        rows="2"
        style="flex: 1; padding: 10px; border: 1px solid #e0e0e0; border-radius: 8px; resize: none; font-size: 14px; outline: none; font-family: inherit;"
      />
      <button
        @click="send"
        :disabled="loading || !input.trim()"
        style="padding: 8px 20px; background: linear-gradient(135deg, #4d6bfe, #34a853); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; white-space: nowrap; font-weight: bold;"
      >
        {{ loading ? '...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
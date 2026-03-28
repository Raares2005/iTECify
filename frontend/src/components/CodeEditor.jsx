import React, { useEffect, useRef } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import Editor from '@monaco-editor/react'

function CodeEditor({ roomName = 'file:src/App.js' }) {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return

    const ydoc = new Y.Doc()

    const provider = new WebsocketProvider(
      'ws://localhost:1234',
      roomName,
      ydoc
    )

    const yText = ydoc.getText('monaco')
    const model = editorRef.current.getModel()

    const binding = new MonacoBinding(
      yText,
      model,
      new Set([editorRef.current]),
      provider.awareness
    )

    return () => {
      binding.destroy()
      provider.destroy()
      ydoc.destroy()
    }
  }, [roomName])

  return (
    <Editor
      height="100vh"
      defaultLanguage="javascript"
      defaultValue=""
      onMount={(editor, monaco) => {
        editorRef.current = editor
        monacoRef.current = monaco
      }}
    />
  )
}

export default CodeEditor
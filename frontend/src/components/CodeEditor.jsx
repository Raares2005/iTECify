import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import Editor from '@monaco-editor/react'

function randomColor() {
  const colors = ['#ff6b6b', '#4dabf7', '#51cf66', '#ffd43b', '#b197fc', '#ffa94d']
  return colors[Math.floor(Math.random() * colors.length)]
}

function CodeEditor({
  roomName = 'file:src/App.js',
  userName = 'Guest'
}) {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const collaborationRef = useRef(null)
  const isInitialized = useRef(false)

  const [collaborators, setCollaborators] = useState([])
  const userColor = useMemo(() => randomColor(), [])

  const handleMount = (editor, monaco) => {
    if (isInitialized.current) return
    isInitialized.current = true

    editorRef.current = editor
    monacoRef.current = monaco

    const ydoc = new Y.Doc()

    const provider = new WebsocketProvider(
      'ws://localhost:1234',
      roomName,
      ydoc
    )

    provider.awareness.setLocalStateField('user', {
      name: userName,
      color: userColor,
      avatar: userName?.[0]?.toUpperCase() || 'U'
    })

    const updateCollaborators = () => {
      const states = Array.from(provider.awareness.getStates().entries())

      const users = states
        .map(([clientId, state]) => ({
          clientId,
          ...(state.user || {})
        }))
        .filter(user => user.name)

      setCollaborators(users)
    }

    provider.awareness.on('change', updateCollaborators)
    updateCollaborators()

    provider.on('status', event => {
      console.log('WebSocket status:', event.status)
    })

    const yText = ydoc.getText('monaco')
    const model = editor.getModel()

    const binding = new MonacoBinding(
      yText,
      model,
      new Set([editor]),
      provider.awareness
    )

    collaborationRef.current = {
      ydoc,
      provider,
      binding,
      updateCollaborators
    }
  }

  useEffect(() => {
    const cleanup = () => {
      if (collaborationRef.current) {
        const { binding, provider, ydoc, updateCollaborators } = collaborationRef.current

        provider.awareness.off('change', updateCollaborators)
        provider.disconnect()
        binding.destroy()
        provider.destroy()
        ydoc.destroy()

        collaborationRef.current = null
        isInitialized.current = false
      }
    }

    window.addEventListener('beforeunload', cleanup)

    return () => {
      cleanup()
      window.removeEventListener('beforeunload', cleanup)
    }
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '50vw',
        top: '20vh'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          display: 'flex',
          gap: '8px',
          background: '#1e1e1e',
          padding: '8px 10px',
          borderRadius: '12px',
          color: 'white'
        }}
      >
        {collaborators.map(user => (
          <div
            key={user.clientId}
            title={user.name}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: user.color || '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 'bold'
            }}
          >
            {user.avatar || '?'}
          </div>
        ))}
      </div>

      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue=""
        onMount={handleMount}
      />
    </div>
  )
}

export default CodeEditor
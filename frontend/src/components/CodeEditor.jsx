import React, { useEffect, useRef,  useState, useMemo} from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import Editor from '@monaco-editor/react'

function randomColor() {
  const colors = ['#ff6b6b', '#4dabf7', '#51cf66', '#ffd43b', '#b197fc', '#ffa94d']
  return colors[Math.floor(Math.random() * colors.length)]
}

function CodeEditor({ 
  roomName = 'room a',
  userName = 'Guest'
 }) {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)

  const [collaborators, setCollaborators] = useState([])

   const userColor = useMemo(() => randomColor(), [])

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return

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
  }, [roomName, userName, userColor])

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
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
        onMount={(editor, monaco) => {
          editorRef.current = editor
          monacoRef.current = monaco
        }}
      />
    </div>
  )
}

export default CodeEditor
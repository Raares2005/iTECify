import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import Editor from '@monaco-editor/react'

function randomColor() {
  const colors = ['#ff6b6b', '#4dabf7', '#51cf66', '#ffd43b', '#b197fc', '#ffa94d']
  return colors[Math.floor(Math.random() * colors.length)]
}

function getLanguageFromFileName(fileName) {
  if (fileName.endsWith('.js')) return 'javascript'
  if (fileName.endsWith('.jsx')) return 'javascript'
  if (fileName.endsWith('.ts')) return 'typescript'
  if (fileName.endsWith('.tsx')) return 'typescript'
  if (fileName.endsWith('.json')) return 'json'
  if (fileName.endsWith('.css')) return 'css'
  if (fileName.endsWith('.html')) return 'html'
  if (fileName.endsWith('.py')) return 'python'
  if (fileName.endsWith('.java')) return 'java'
  if (fileName.endsWith('.cpp')) return 'cpp'
  return 'plaintext'
}

function CodeEditor({
  roomName = 'file:src/App.js',
  userName = 'Guest',
  fileId
}) {
  const editorRef = useRef(null)
  const monacoRef = useRef(null)
  const collaborationRef = useRef(null)
  const isInitialized = useRef(false)
  const decorationIdsRef = useRef([])
  const styleElementRef = useRef(null)
  const saveTimeoutRef = useRef(null)
  const hasLoadedInitialContentRef = useRef(false)
  const isApplyingInitialContentRef = useRef(false)

  const [collaborators, setCollaborators] = useState([])
  const userColor = useMemo(() => randomColor(), [])

  const injectCursorStyle = (clientId, color, name) => {
    if (!styleElementRef.current) {
      styleElementRef.current = document.createElement('style')
      document.head.appendChild(styleElementRef.current)
    }

    const styleId = `remote-line-${clientId}`
    const css = `
      .${styleId} {
        background: ${color}22;
      }

      .${styleId}::after {
        content: "${name}";
        position: absolute;
        right: 16px;
        top: 0;
        background: ${color};
        color: black;
        font-size: 11px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 999px;
        pointer-events: none;
      }
    `

    if (!styleElementRef.current.innerHTML.includes(styleId)) {
      styleElementRef.current.innerHTML += css
    }
  }

  const saveFileToBackend = async (content) => {
    if (!fileId) return

    try {
      const res = await fetch(`http://localhost:5000/api/files/${fileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Failed to save file')
      }

      console.log('File saved')
    } catch (error) {
      console.error('Error saving file:', error)
    }
  }

  const scheduleSave = (content) => {
    if (!fileId) return
    if (!hasLoadedInitialContentRef.current) return
    if (isApplyingInitialContentRef.current) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveFileToBackend(content)
    }, 500)
  }

  const handleMount = async (editor, monaco) => {
    if (isInitialized.current) return
    isInitialized.current = true

    editorRef.current = editor
    monacoRef.current = monaco

    const ydoc = new Y.Doc()
    const provider = new WebsocketProvider('ws://localhost:1234', roomName, ydoc)

    provider.awareness.setLocalStateField('user', {
      name: userName,
      color: userColor,
      avatar: userName?.[0]?.toUpperCase() || 'U'
    })

    const updateLocalCursor = () => {
      const position = editor.getPosition()
      if (!position) return

      provider.awareness.setLocalStateField('cursor', {
        lineNumber: position.lineNumber
      })
    }

    const updateCollaborators = () => {
      const states = Array.from(provider.awareness.getStates().entries())

      const users = states
        .map(([clientId, state]) => ({
          clientId,
          ...(state.user || {}),
          cursor: state.cursor || null
        }))
        .filter(user => user.name)

      setCollaborators(users)

      const remoteUsers = users.filter(
        user => user.clientId !== provider.awareness.clientID
      )

      const decorations = []

      remoteUsers.forEach(user => {
        const lineNumber = user.cursor?.lineNumber
        if (!lineNumber) return

        const className = `remote-line-${user.clientId}`
        injectCursorStyle(user.clientId, user.color || '#666', user.name)

        decorations.push({
          range: new monaco.Range(lineNumber, 1, lineNumber, 1),
          options: {
            isWholeLine: true,
            className
          }
        })
      })

      decorationIdsRef.current = editor.deltaDecorations(
        decorationIdsRef.current,
        decorations
      )
    }

    provider.awareness.on('change', updateCollaborators)
    editor.onDidChangeCursorPosition(updateLocalCursor)

    updateLocalCursor()
    updateCollaborators()

    provider.on('status', event => {
      console.log('WebSocket status:', event.status)
    })

    const uri = monaco.Uri.parse(`file://${roomName}`)
    const language = getLanguageFromFileName(roomName)

    let model = monaco.editor.getModel(uri)

    if (!model) {
      model = monaco.editor.createModel('', language, uri)
    }

    editor.setModel(model)

    const yText = ydoc.getText(roomName)

    const binding = new MonacoBinding(
      yText,
      model,
      new Set([editor]),
      provider.awareness
    )

    const handleYTextChange = () => {
      const content = yText.toString()
      scheduleSave(content)
    }

    yText.observe(handleYTextChange)

    collaborationRef.current = {
      ydoc,
      provider,
      binding,
      updateCollaborators,
      yText,
      handleYTextChange
    }

    if (fileId) {
      try {
        const res = await fetch(`http://localhost:5000/api/files/${fileId}`)
        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Failed to load file')
        }

        const initialContent = data.content || ''

        isApplyingInitialContentRef.current = true

        ydoc.transact(() => {
          yText.delete(0, yText.length)
          yText.insert(0, initialContent)
        })

        isApplyingInitialContentRef.current = false
        hasLoadedInitialContentRef.current = true
      } catch (error) {
        isApplyingInitialContentRef.current = false
        console.error('Error loading file:', error)
      }
    } else {
      hasLoadedInitialContentRef.current = true
    }
  }

  useEffect(() => {
    const cleanup = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }

      if (collaborationRef.current) {
        const {
          binding,
          provider,
          ydoc,
          updateCollaborators,
          yText,
          handleYTextChange
        } = collaborationRef.current

        provider.awareness.off('change', updateCollaborators)
        yText.unobserve(handleYTextChange)
        provider.disconnect()
        binding.destroy()
        provider.destroy()
        ydoc.destroy()

        collaborationRef.current = null
        isInitialized.current = false
      }

      if (editorRef.current) {
        decorationIdsRef.current = editorRef.current.deltaDecorations(
          decorationIdsRef.current,
          []
        )
      }

      if (styleElementRef.current) {
        styleElementRef.current.remove()
        styleElementRef.current = null
      }

      hasLoadedInitialContentRef.current = false
      isApplyingInitialContentRef.current = false
    }

    window.addEventListener('beforeunload', cleanup)

    return () => {
      cleanup()
      window.removeEventListener('beforeunload', cleanup)
    }
  }, [roomName, fileId])

  return (
    <div
      style={{
        position: 'relative',
        height: '100vh',
        width: '80vw',
        left: '20vw'
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
        path={roomName}
        defaultLanguage={getLanguageFromFileName(roomName)}
        onMount={handleMount}
      />
    </div>
  )
}

export default CodeEditor
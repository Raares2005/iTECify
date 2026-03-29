import { useState, useEffect } from 'react';

const DEFAULT_FILE_NAME = 'main.js';

function FileExplorer({ onSelectFile, selectedFileId }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    initializeFiles();
  }, []);

  const initializeFiles = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/files');
      const data = await res.json();

      let currentFiles = Array.isArray(data) ? data : [];

      let defaultFile =
        currentFiles.find((file) => file.name === DEFAULT_FILE_NAME) || null;

      if (!defaultFile) {
        const createRes = await fetch('http://localhost:5000/api/files', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: DEFAULT_FILE_NAME,
            content: ''
          })
        });

        const createdFile = await createRes.json();

        if (!createRes.ok) {
          throw new Error(createdFile.message || 'Failed to create default file');
        }

        currentFiles = [...currentFiles, createdFile];
        defaultFile = createdFile;
      }

      setFiles(currentFiles);

      if (!selectedFileId) {
        onSelectFile(defaultFile);
      }
    } catch (err) {
      console.error('Error loading files:', err);
    }
  };

  const handleAddFile = async () => {
    const fileName = prompt('Enter file name:');

    if (!fileName || !fileName.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fileName.trim(), content: '' }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create file');
      }

      setFiles((prev) => [...prev, data]);
      onSelectFile(data);
    } catch (err) {
      console.error('Error creating file:', err);
    }
  };

  const handleSelectFile = (file) => {
    onSelectFile(file);
  };

  return (
    <div
      style={{
        position: 'absolute',
        height: '100vh',
        width: '20vw',
        left: '0',
        background: '#f8f8f8',
        borderRight: '1px solid #ddd',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          width: '100%',
          background: 'lightgrey',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          boxSizing: 'border-box',
        }}
      >
        <h4 style={{ margin: 0 }}>File List</h4>

        <button
          style={{
            width: 'auto',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 10px',
            fontSize: '16px',
            border: '1px solid gray',
            background: 'white',
            cursor: 'pointer',
            boxSizing: 'border-box',
            transition: 'background 0.15s ease',
          }}
          onClick={handleAddFile}
          onMouseDown={(e) => (e.currentTarget.style.background = '#ddd')}
          onMouseUp={(e) => (e.currentTarget.style.background = 'white')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
        >
          Add
        </button>
      </div>

      <div style={{ padding: '10px' }}>
        {files.map((file) => (
          <div
            key={file._id}
            onClick={() => handleSelectFile(file)}
            style={{
              padding: '8px 10px',
              borderBottom: '1px solid #ccc',
              cursor: 'pointer',
              background: selectedFileId === file._id ? '#dbeafe' : 'white',
              fontWeight: selectedFileId === file._id ? 600 : 400,
            }}
          >
            {file.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileExplorer;
import { useState, useEffect } from 'react';

function FileExplorer({ onSelectFile, selectedFileId }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/files");
      const text = await res.text();
      console.log("fetchFiles response:", text);

      const data = JSON.parse(text);
      setFiles(data);
    } catch (err) {
      console.error("Error loading files:", err);
    }
  };

  const handleAddFile = async () => {
    console.log("Add clicked");
    const fileName = prompt("Enter file name:");
    console.log("fileName:", fileName);

    if (!fileName || !fileName.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/api/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fileName, content: '' }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setFiles((prev) => [...prev, data]);

      // automatically open new file
      onSelectFile(data._id);
    } catch (err) {
      console.error('Error creating file:', err);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        height: '100vh',
        width: '20vw',
        left: '0',
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
            onClick={() => onSelectFile && onSelectFile(file._id)}
            style={{
              padding: '6px',
              borderBottom: '1px solid #ccc',
              cursor: 'pointer',
              background: selectedFileId === file._id ? '#dbeafe' : 'white',
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
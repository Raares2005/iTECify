import { useState, useEffect } from "react";

const DEFAULT_FILE_NAME = "main.js";

function FileExplorer({ onSelectFile, selectedFileId }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    initializeFiles();
  }, []);

  const initializeFiles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/files");
      const data = await res.json();

      let currentFiles = Array.isArray(data) ? data : [];

      let defaultFile =
        currentFiles.find((file) => file.name === DEFAULT_FILE_NAME) || null;

      if (!defaultFile) {
        const createRes = await fetch("http://localhost:5000/api/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: DEFAULT_FILE_NAME,
            content: "",
          }),
        });

        const createdFile = await createRes.json();

        if (!createRes.ok) {
          throw new Error(
            createdFile.message || "Failed to create default file",
          );
        }

        currentFiles = [...currentFiles, createdFile];
        defaultFile = createdFile;
      }

      setFiles(currentFiles);

      if (!selectedFileId) {
        onSelectFile(defaultFile);
      }
    } catch (err) {
      console.error("Error loading files:", err);
    }
  };

  const handleAddFile = async () => {
    const fileName = prompt("Enter file name:");

    if (!fileName || !fileName.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fileName.trim(), content: "" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create file");
      }

      setFiles((prev) => [...prev, data]);
      onSelectFile(data);
    } catch (err) {
      console.error("Error creating file:", err);
    }
  };

  const handleSelectFile = (file) => {
    onSelectFile(file);
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        width: "20vw",
        left: "0",
        background:
          "radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.25), transparent 25%), radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.2), transparent 30%), linear-gradient(135deg, #020617, #84a9eb, #ffffff)",
        borderRight: "1px solid #ddd",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "21px 20px",
          boxSizing: "border-box",
        }}
      >
        <h4 style={{ 
          
          margin: 0,
          color: '#fff',
          fontSize: "21px",
          fontWeight: "600",
          }}>File List</h4>

        <button
          style={{
            width: "auto",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px 10px",
            fontSize: "20px",
            color: "#fff",
            fontWeight: '600',

            background: 'rgba(255, 255, 255, 0.12)',
            border: '1px solid rgba(255, 255, 255, 0.18)',

             borderRadius: '12px',
            transition: 'border-color 0.55s ease, box-shadow 0.25s ease, background-color 0.25s ease',
            cursor: "pointer",
            boxSizing: "border-box",
           
          }}
          onClick={handleAddFile}
          onMouseDown={(e) => (e.currentTarget.style.background = "#fafafa00")}
          onMouseUp={(e) => (e.currentTarget.style.background = "transparent")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          Add
        </button>
      </div>

      <div style={{ 
        
        padding: "10px",
       

       }}>
        {files.map((file) => (
          <div
            key={file._id}
            onClick={() => handleSelectFile(file)}
            style={{
              padding: "18px 10px",
              marginTop: "1rem",
              borderRadius: "10px",
              borderBottom: "1px solid #ccc",
              cursor: "pointer",
              background: selectedFileId === file._id ? "#dbeafe" : "white",
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

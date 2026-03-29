import { useState } from 'react';
import { useSelector } from 'react-redux';
import CodeEditor from '../components/CodeEditor';
import FileExplorer from '../components/FileExplorer';

function CodeScreen() {
  const { userInfo } = useSelector((state) => state.auth);

  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <div style={{ display: 'flex' }}>
      <FileExplorer
        onSelectFile={setSelectedFile}
        selectedFileId={selectedFile?._id || null}
      />

      <div style={{  width: '80vw', height: '100vh' }}>
        <CodeEditor
          key={selectedFile?._id || 'default-file'}
          fileId={selectedFile?._id || null}
          fileName={selectedFile?.name || 'main.js'}
          roomName={selectedFile?._id ? `file:${selectedFile._id}` : 'file:default'}
          userName={userInfo?.name || userInfo?.email || 'Guest'}
        />
      </div>
    </div>
  );
}

export default CodeScreen;
import { useState } from 'react';
import { useSelector } from 'react-redux';
import CodeEditor from '../components/CodeEditor';
import FileExplorer from '../components/FileExplorer';

function CodeScreen() {
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedFileId, setSelectedFileId] = useState(null);

  return (
    <div style={{ display: 'flex' }}>
      <FileExplorer
        onSelectFile={setSelectedFileId}
        selectedFileId={selectedFileId}
      />

      <div style={{ marginLeft: '20vw', width: '80vw', height: '100vh' }}>
        <CodeEditor
          fileId={selectedFileId}
          roomName={selectedFileId ? `file:${selectedFileId}` : 'file:default'}
          userName={userInfo?.name || userInfo?.email || 'Guest'}
        />
      </div>
    </div>
  );
}

export default CodeScreen;
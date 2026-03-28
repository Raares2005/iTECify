import { useSelector } from 'react-redux';
import CodeEditor from '../components/CodeEditor';
import FileExplorer from '../components/FileExplorer'

function CodeScreen() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div>
    <FileExplorer/>
    <CodeEditor
      roomName="file:src/App.js"
      userName={userInfo?.name || userInfo?.email || 'Guest'}
    />
    </div>
    
  );
}

export default CodeScreen;
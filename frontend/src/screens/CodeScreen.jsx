import { useSelector } from 'react-redux';
import CodeEditor from '../components/CodeEditor';

function CodeScreen() {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <CodeEditor
      roomName="file:src/App.js"
      userName={userInfo?.name || userInfo?.email || 'Guest'}
    />
  );
}

export default CodeScreen;
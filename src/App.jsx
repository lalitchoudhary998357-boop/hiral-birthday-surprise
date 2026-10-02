import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PreviewBirthday from './pages/PreviewBirthday';
import ShareSuccess from './pages/ShareSuccess';
import ViewBirthday from './pages/ViewBirthday';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preview" element={<PreviewBirthday />} />
        <Route path="/share" element={<ShareSuccess />} />
        <Route path="/birthday/:shareToken" element={<ViewBirthday />} />
      </Routes>
    </Router>
  );
}

export default App;

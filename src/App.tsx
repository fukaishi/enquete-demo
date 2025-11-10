import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Builder from './pages/Builder';
import SurveyView from './pages/SurveyView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/survey" element={<SurveyView />} />
      </Routes>
    </Router>
  );
}

export default App;

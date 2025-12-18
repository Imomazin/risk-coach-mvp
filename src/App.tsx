import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { RiskRegister } from './pages/RiskRegister';
import { Alerts } from './pages/Alerts';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { AICoach } from './pages/AICoach';
import { Team } from './pages/Team';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/risks" element={<RiskRegister />} />
      <Route path="/alerts" element={<Alerts />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/ai-coach" element={<AICoach />} />
      <Route path="/team" element={<Team />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/help" element={<Dashboard />} /> {/* Placeholder */}
    </Routes>
  );
}

export default App;

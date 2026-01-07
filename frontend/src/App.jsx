import { Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSimple from './pages/RegisterSimple';
import RegisterTest from './pages/RegisterTest';
import TestPage from './pages/TestPage';
import Dashboard from './pages/Dashboard';
import Budgets from './pages/Budgets';
import Transactions from './pages/Transactions';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import AIAssistant from './pages/AIAssistant';

// Components
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/test" element={<TestPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register-simple" element={<RegisterSimple />} />
      <Route path="/register-test" element={<RegisterTest />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="budgets" element={<Budgets />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="goals" element={<Goals />} />
        <Route path="profile" element={<Profile />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

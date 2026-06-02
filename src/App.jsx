import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import UserLogin from './pages/UserLogin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import FormList from './pages/FormList';
import ClientStatus from './pages/ClientStatus';
import CKYCDataCount from './pages/CKYCDataCount';
import Users from './pages/Users';
import Reports from './pages/Reports';
import PreRequisiteForm from './pages/PreRequisiteForm';
import ComingSoon from './pages/ComingSoon';
import './styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/ckycform/" element={<Home />} />
          <Route path="/ckycform/login" element={<Login />} />
          <Route path="/ckycform/user-login" element={<UserLogin />} />
          <Route path="/ckycform/signup" element={<Signup />} />
          <Route path="/ckycform/form" element={<PreRequisiteForm />} />

          {/* Protected Dashboard Routes */}
          <Route path="/ckycform/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="forms" element={<FormList />} />
            <Route path="client-status" element={<ClientStatus />} />
            <Route path="ckyc-data-count" element={<CKYCDataCount />} />
            <Route path="users" element={<Users />} />
            <Route path="projects" element={<ComingSoon />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<ComingSoon />} />
            <Route path="help" element={<ComingSoon />} />
            <Route path="profile" element={<ComingSoon />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/ckycform/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

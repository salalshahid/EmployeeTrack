import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import './utils/stringUtils';
import { useAuth } from './contexts/AuthContext';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ProSidebarProvider } from 'react-pro-sidebar';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './pages/Dashboard';
import ManageLogReports from './pages/ManageLogReports';
import CreateTeam from './pages/CreateTeam';
import CreateProject from './pages/CreateProject';
import AddTime from './pages/AddTime';
import AssignedProjects from './pages/AssignedProjects';
import TimeTracking from './pages/TimeTracking';
import ManageUsers from './pages/ManageUsers';
import ManageProjects from './pages/ManageProjects';
import ManageTeams from './pages/ManageTeams';
import VerifyOTP from './pages/VerifyOTP';
import SendPasswordResetMail from './pages/SendPasswordResetMail';
import Notifications from './pages/Notifications';
import SetNewPassword from './pages/SetNewPassword';
import EditProjectInfo from './pages/EditProjectInfo';
import EditTeamInfo from './pages/EditTeamInfo';

function App() {
  const { isLoggedIn } = useAuth();
  
  const PrivateRoute = () => {
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <ProSidebarProvider>
      <div style={{ display: 'flex' }}>
        {isLoggedIn && <Sidebar />}
        <div style={{ flexGrow: 1 }}>
          {isLoggedIn && <Navbar />}
          <Routes>
            <Route path="/" element={<PrivateRoute />}>
              <Route path="/" element={<Dashboard />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/add-time" element={<AddTime />} />
            <Route path="/time-logs" element={<TimeTracking />} />
            <Route path="/assigned-projects" element={<AssignedProjects />} />
            <Route path="/create-team" element={<CreateTeam />} />
            <Route path="/edit-team/:teamId" element={<EditTeamInfo />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/edit-project/:projectId" element={<EditProjectInfo />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/reports" element={<ManageLogReports />} />
            <Route path="/manage-users" element={<ManageUsers />} />
            <Route path="/manage-projects" element={<ManageProjects />} />
            <Route path="/manage-teams" element={<ManageTeams />} />
            <Route path="/reset-password-request" element={<SendPasswordResetMail />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/reset-password" element={<SetNewPassword />} />
            <Route path="/notifications" element={<Notifications />} />
        </Routes>
        </div>
      </div>
    </ProSidebarProvider>
  );
}

export default App;
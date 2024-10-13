// Sidebar.js
import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { FaHome, FaUsers, FaUserEdit, FaClock, FaKey, FaFileDownload, FaSignOutAlt } from 'react-icons/fa';
import { VscProject } from "react-icons/vsc";
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarComponent = () => {
  const { isAdmin, isAdminOrManager, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle logout
  const handleNavigate = (link) => {
    if (link === '/logout') {
      logout();
      navigate('/login');
    } else {
      navigate(link);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const activeStyle = {
    backgroundColor: '#007bff',
    color: '#fff',
  };

  return (
    <Sidebar>
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <img src="/images/company-logo.png" alt="Company Logo" style={{ width: '75px', cursor: 'pointer' }} onClick={() => handleNavigate('/')} />
        <h3>Employee Track</h3>
      </div>
      <Menu iconShape="circle">
        <MenuItem icon={<FaHome />} style={isActive('/') ? activeStyle : {}} onClick={() => handleNavigate('/')}>Home</MenuItem>
        {isAdmin && (
          <MenuItem icon={<FaUserEdit />} style={isActive('/manage-users') ? activeStyle : {}} onClick={() => handleNavigate('/manage-users')}>Manage Users</MenuItem>
        )}
        {isAdminOrManager && (
          <>      
            <MenuItem icon={<VscProject />} style={isActive('/manage-projects') ? activeStyle : {}} onClick={() => handleNavigate('/manage-projects')}>Manage Projects</MenuItem>
            <MenuItem icon={<FaUsers />} style={isActive('/manage-teams') ? activeStyle : {}} onClick={() => handleNavigate('/manage-teams')}>Manage Teams</MenuItem>
            <MenuItem icon={<FaFileDownload />} style={isActive('/reports') ? activeStyle : {}} onClick={() => handleNavigate('/reports')}>Download Reports</MenuItem>
          </>
        )}
        {!isAdmin && (
          <MenuItem icon={<VscProject />} style={isActive('/assigned-projects') ? activeStyle : {}} onClick={() => handleNavigate('/assigned-projects')}>
            Assigned Projects
          </MenuItem>
        )}
        <MenuItem icon={<FaClock />} style={isActive('/time-logs') ? activeStyle : {}} onClick={() => handleNavigate('/time-logs')}>Time Tracking</MenuItem>
        <MenuItem icon={<FaKey />} style={isActive('/change-password') ? activeStyle : {}} onClick={() => handleNavigate('/change-password')}>Change Password</MenuItem>
        <MenuItem icon={<FaSignOutAlt />} onClick={() => handleNavigate('/logout')}>Logout</MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SidebarComponent;

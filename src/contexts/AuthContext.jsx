import { createContext, useContext, useState } from 'react';

const ACCESS_LEVELS = {
  FULL_PHI: 'full_phi_access',
  LIMITED_PHI: 'limited_phi_access',
  NO_PHI: 'no_phi_access'
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 1,
    name: 'Admin User',
    role: 'admin',
    hipaaAccessLevel: ACCESS_LEVELS.FULL_PHI,
    permissions: [
      'view_dashboard',
      'view_projects',
      'edit_projects',
      'view_messages',
      'view_documents',
      'view_settings',
      'manage_users',
      'access_phi'
    ]
  });

  const hasPermission = (permission) => {
    return user?.permissions.includes(permission);
  };

  const canAccessPHI = () => {
    return user?.hipaaAccessLevel === ACCESS_LEVELS.FULL_PHI;
  };

  return (
    <AuthContext.Provider value={{ user, setUser, hasPermission, canAccessPHI }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
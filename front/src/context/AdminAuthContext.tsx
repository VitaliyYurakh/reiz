'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

interface AdminAuthContextType {
  isAuthorized: boolean;
  userRole: string;
  userPermissions: Record<string, string>;
  setAuth: (role: string, permissions: Record<string, string>) => void;
  clearAuth: () => void;
  hasPermission: (module: string, level?: 'view' | 'full') => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>(null!);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userPermissions, setUserPermissions] = useState<Record<string, string>>({});

  const setAuth = useCallback((role: string, permissions: Record<string, string>) => {
    setUserRole(role);
    setUserPermissions(permissions);
    setIsAuthorized(true);
  }, []);

  const clearAuth = useCallback(() => {
    setUserRole('');
    setUserPermissions({});
    setIsAuthorized(false);
  }, []);

  // Mirrors backend requirePermission logic exactly
  const hasPermission = useCallback((module: string, level: 'view' | 'full' = 'view') => {
    if (userRole === 'admin') return true;
    const userLevel = userPermissions[module] || 'none';
    if (level === 'view') return userLevel === 'view' || userLevel === 'full';
    if (level === 'full') return userLevel === 'full';
    return false;
  }, [userRole, userPermissions]);

  return (
    <AdminAuthContext.Provider value={{ isAuthorized, userRole, userPermissions, setAuth, clearAuth, hasPermission }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

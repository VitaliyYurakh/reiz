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

  // Mirrors backend requirePermission logic exactly. Post-RBAC there is no
  // hard-coded admin bypass — the Admin role's permissions map already has
  // every module at 'full', so it passes naturally. `userRole` is the role's
  // human-readable name and is kept around for sidebar / profile display.
  const hasPermission = useCallback((module: string, level: 'view' | 'full' = 'view') => {
    const userLevel = userPermissions[module] || 'none';
    if (level === 'view') return userLevel === 'view' || userLevel === 'full';
    if (level === 'full') return userLevel === 'full';
    return false;
  }, [userPermissions]);

  return (
    <AdminAuthContext.Provider value={{ isAuthorized, userRole, userPermissions, setAuth, clearAuth, hasPermission }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

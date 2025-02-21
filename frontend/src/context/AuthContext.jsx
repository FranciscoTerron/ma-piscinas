import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [userRole, setUserRole] = useState(() => {
    return sessionStorage.getItem('userRole') || null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null; 
  });

  const [userId, setUserId] = useState(() => {
    return sessionStorage.getItem('userId') || null;
  });

  const [userName, setUserName] = useState(() => {
    return sessionStorage.getItem('userName') || null;
  });

  useEffect(() => {
    if (isAuthenticated) {
      sessionStorage.setItem('isAuthenticated', 'true');
    } else {
      sessionStorage.removeItem('isAuthenticated');
    }

    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }

    if (userRole) {
      sessionStorage.setItem('userRole', userRole);
    } else {
      sessionStorage.removeItem('userRole');
    }

    if (userId) {
      sessionStorage.setItem('userId', userId);
    } else {
      sessionStorage.removeItem('userId');
    }

    if (userName) {
      sessionStorage.setItem('userName', userName);
    } else {
      sessionStorage.removeItem('userName');
    }

    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [isAuthenticated, user, userRole, userId, userName, token]);

  const login = (userData, authToken, userIdValue, userNameValue, role) => {
    setIsAuthenticated(true);
    setUser(userData);
    setUserRole(role);
    setUserId(userIdValue);
    setUserName(userNameValue);
    setToken(authToken);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserId(null);
    setUserName(null);
    setUserRole(null); 
    setToken(null);

    sessionStorage.clear();
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userId, userRole, userName, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

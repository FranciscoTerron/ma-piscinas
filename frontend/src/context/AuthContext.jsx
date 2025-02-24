import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('userRole') || null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null; 
  });

  const [userId, setUserId] = useState(() => {
    return localStorage.getItem('userId') || null;
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || null;
  });

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      localStorage.removeItem('isAuthenticated');
    }

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }

    if (userRole) {
      localStorage.setItem('userRole', userRole);
    } else {
      localStorage.removeItem('userRole');
    }

    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }

    if (userName) {
      localStorage.setItem('userName', userName);
    } else {
      localStorage.removeItem('userName');
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

    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userId, userRole, userName, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
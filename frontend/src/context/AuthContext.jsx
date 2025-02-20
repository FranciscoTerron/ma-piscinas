import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = sessionStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  });

  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [userRole, setUserRole] = useState(() => {
    const storedRole = sessionStorage.getItem('userRole');
    return storedRole ? storedRole : null;
  });

  const [token, setToken] = useState(() => {
    const storedToken = sessionStorage.getItem('token');
    return storedToken ? storedToken : null;
  });

  const [userId, setUserId] = useState(() => {
    const storedUserId = sessionStorage.getItem('userId');
    return storedUserId ? storedUserId : null;
  });

  const [userName, setUserName] = useState(() => {
    const storedUserName = sessionStorage.getItem('userName');
    return storedUserName ? storedUserName : null;
  });

  useEffect(() => {
    if (isAuthenticated !== null) {
      sessionStorage.setItem('isAuthenticated', isAuthenticated);
    }
    if (user !== null) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
    if (token !== null) {
      sessionStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('token');
    }
    if (userId !== null) {
      sessionStorage.setItem('userId', userId);
    } else {
      sessionStorage.removeItem('userId');
    }
    if (userName !== null) {
      sessionStorage.setItem('userName', userName);
    } else {
      sessionStorage.removeItem('userName');
    }
    if (userRole !== null) {
      sessionStorage.setItem('userRole', userRole);
    } else {
      sessionStorage.removeItem('userRole');
    }
  }, [isAuthenticated, user, token, userId, userName, userRole]);

  const login = (userData, authToken, userIdValue, userNameValue, userRole) => {
    setIsAuthenticated(true);
    setUser(userData);
    setUserRole(userRole);
    setUserId(userIdValue);
    setUserName(userNameValue);
    setToken(authToken);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserId(null);
    setUserName(null);
    setToken(null);

    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userId, userRole, userName, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

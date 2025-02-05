import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    return storedAuth === 'true';
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken ? storedToken : null;
  });

  const [userId, setUserId] = useState(() => {
    const storedUserId = localStorage.getItem('userId');
    return storedUserId ? storedUserId : null;
  });

  const [userName, setUserName] = useState(() => {
    const storedUserName = localStorage.getItem('userName');
    return storedUserName ? storedUserName : null;
  });

  useEffect(() => {
    if (isAuthenticated !== null) {
      localStorage.setItem('isAuthenticated', isAuthenticated);
    }
    if (user !== null) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    if (token !== null) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
    if (userId !== null) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
    if (userName !== null) {
      localStorage.setItem('userName', userName);
    } else {
      localStorage.removeItem('userName');
    }
  }, [isAuthenticated, user, token, userId, userName]);

  const login = (userData, authToken, userIdValue, userNameValue) => {
    setIsAuthenticated(true);
    setUser(userData);
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

    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userId, userName ,token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
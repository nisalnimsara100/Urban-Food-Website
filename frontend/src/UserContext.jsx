import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const login = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
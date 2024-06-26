import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import config from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Cookies.get('isLoggedIn') === 'true');
  const [username, setUsername] = useState(() => Cookies.get('username') || '');
  const [userId, setUserId] = useState(() => Cookies.get('userId') || '');
  const [role, setRole] = useState(() => Cookies.get('role') || 'user');
  const [token, setToken] = useState(() => Cookies.get('token') || '');

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setUserId('');
    setRole('user');
    setToken('');
    Cookies.remove('userId');
    Cookies.remove('role');
    Cookies.remove('token');
    Cookies.remove('isLoggedIn');
  };

  useEffect(() => {
    const expiryTime = config.cookieExpiryMinutes / (24 * 60); // Convert minutes to days
    Cookies.set('isLoggedIn', isLoggedIn, { expires: expiryTime, sameSite: 'Strict' });
    if (!isLoggedIn) {
      Cookies.remove('isLoggedIn');
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const expiryTime = config.cookieExpiryMinutes / (24 * 60); // Convert minutes to days
    Cookies.set('username', username, { expires: expiryTime, sameSite: 'Strict' });
    if (!username) {
      Cookies.remove('username');
    }
  }, [username]);

  useEffect(() => {
    const expiryTime = config.cookieExpiryMinutes / (24 * 60); // Convert minutes to days
    Cookies.set('userId', userId, { expires: expiryTime, sameSite: 'Strict' });
    if (!userId) {
      Cookies.remove('userId');
    }
  }, [userId]);

  useEffect(() => {
    const expiryTime = config.cookieExpiryMinutes / (24 * 60); // Convert minutes to days
    Cookies.set('role', role, { expires: expiryTime, sameSite: 'Strict' });
    if (!role) {
      Cookies.remove('role');
    }
  }, [role]);

  useEffect(() => {
    const expiryTime = config.cookieExpiryMinutes / (24 * 60); // Convert minutes to days
    Cookies.set('token', token, { expires: expiryTime, sameSite: 'Strict' });
    if (!token) {
      Cookies.remove('token');
    }
  }, [token]);

  useEffect(() => {
    const checkExpiry = () => {
      const token = Cookies.get('token');
      if (isLoggedIn && !token) {
        alert('Session expired. Please log in again.');
        logout();
      }
    };

    // Set interval based on cookie expiry time
    const interval = setInterval(checkExpiry, config.cookieExpiryMinutes * 60 * 1000); // Convert minutes to milliseconds
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, username, setUsername, userId, setUserId, role, setRole, token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

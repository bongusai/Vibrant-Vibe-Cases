// src/contexts/AuthContext.js
import axios from 'axios';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = "http://localhost:5000/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const INACTIVITY_TIMEOUT = 60000; // (5min = 300,000ms)

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  console.log(inactivityTimeoutRef)

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { user, token } = response.data;

      localStorage.setItem('user', JSON.stringify(user));

      localStorage.setItem("token", token);

      localStorage.setItem("userEmail", user.email);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      setUser(user);
      resetInactivityTimeout();

      console.log('User:', user);
      console.log('Loading:', loading);

      return user;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };


  const signup = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData);

      const { user, token } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Set axios default header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Signup failed");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      document.cookie = "googtrans=/en/en; path=/";
      localStorage.removeItem('token');
      localStorage.removeItem("selectedLanguage");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("user");

      // localStorage.removeItem("previousLanguage");
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);

      if (inactivityTimeoutRef.current)
        clearTimeout(inactivityTimeoutRef.current);
      navigate('/login');
      window.location.reload();
    }
  };

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data.user);
      resetInactivityTimeout(); // Ensure timeout resets on successful login
    } catch (error) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Reset inactivity timeout
  const resetInactivityTimeout = () => {
    if (inactivityTimeoutRef.current)
      clearTimeout(inactivityTimeoutRef.current);

    if (user) {
      inactivityTimeoutRef.current = setTimeout(() => {
        logout();
      }, INACTIVITY_TIMEOUT);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleActivity = () => resetInactivityTimeout();
  
    // For desktop interactions
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
  
    // For mobile interactions
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('scroll', handleActivity);
  
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };
  }, [user]);
  

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading,signup, resetInactivityTimeout }}
    >
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

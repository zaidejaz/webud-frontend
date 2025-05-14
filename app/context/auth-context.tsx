import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { 
  login as loginApi, 
  register as registerApi, 
  getCurrentUser,
  logout as logoutApi,
  LoginCredentials,
  RegisterCredentials,
  User,
  AuthResponse
} from '~/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsLoading(true);
      getCurrentUser(token)
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          // Token might be expired or invalid
          localStorage.removeItem('auth_token');
          localStorage.removeItem('token_type');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authResponse: AuthResponse = await loginApi(credentials);
      localStorage.setItem('auth_token', authResponse.access_token);
      localStorage.setItem('token_type', authResponse.token_type);
      
      const userData = await getCurrentUser(authResponse.access_token);
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await registerApi(credentials);
      // After successful registration, log the user in
      await login({ 
        username: credentials.email,
        password: credentials.password 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutApi();
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
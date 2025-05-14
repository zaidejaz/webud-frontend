// Authentication utility functions

// API URL - replace with your actual API URL
const API_URL = 'http://localhost:8000';

// Types
export interface LoginCredentials {
  username: string; // Email is used as username
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  profile_picture: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Login function
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  console.log('Login function called with:', credentials);
  console.log('API URL:', API_URL);
  
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  try {
    console.log('Sending login request to:', `${API_URL}/api/v1/auth/login`);
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Login error:', error);
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    console.log('Login successful:', data);
    return data;
  } catch (error) {
    console.error('Login exception:', error);
    throw error;
  }
}

// Register function
export async function register(credentials: RegisterCredentials) {
  console.log('Register function called with:', credentials);
  console.log('API URL:', API_URL);
  
  try {
    console.log('Sending register request to:', `${API_URL}/api/v1/auth/register`);
    const response = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    console.log('Register response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Register error:', error);
      throw new Error(error.detail || 'Registration failed');
    }

    const data = await response.json();
    console.log('Registration successful:', data);
    return data;
  } catch (error) {
    console.error('Register exception:', error);
    throw error;
  }
}

// Get current user
export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${API_URL}/api/v1/auth/me`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user information');
  }

  return response.json();
}

// Logout function (client-side only since we're using JWT)
export function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('token_type');
} 
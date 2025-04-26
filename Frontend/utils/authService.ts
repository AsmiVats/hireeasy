interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  companyName?: string;
  companySize?: string;
  userType?: string;
  isActive?: boolean;
  planId?: number;
}

interface AuthResponse {
  [x: string]: any;
  user: {
    userId: string;
    email: string;
    name: string;
  };
  token: string;
}

let loggedIn = false;

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Login failed');
    }
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    try {
      // Check if the email already exists
      const existingUserResponse = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });   
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Signup failed');
    }
  },

  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    return !!(
      localStorage.getItem('token') ||
      localStorage.getItem('user') ||
      localStorage.getItem('staySignedIn')
    );
  },
  resetPassword: async (data: { email: string }): Promise<{ message: string }> => {
    try {
      const response = await fetch(`${BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Password reset request failed');
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Password reset failed');
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('staySignedIn');
    }
  }
};

import axios from 'axios';

// Define types
interface AuthResponse {
  isAuthenticated: boolean;
  user?: {
    email: string;
    name: string;
    picture?: string;
  };
}

/**
 * Check if the user is authenticated
 * @returns Promise with authentication status and user info
 */
export const checkAuthStatus = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.get('/api/auth/status', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return { isAuthenticated: false };
  }
};

/**
 * Authenticate with Google
 * @param tokenId Google OAuth token ID
 * @returns Promise with authentication result
 */
export const authenticateWithGoogle = async (tokenId: string): Promise<AuthResponse> => {
  try {
    const response = await axios.post('/api/auth/google', { tokenId }, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Authentication error:', error);
    return { isAuthenticated: false };
  }
};

/**
 * Logout the current user
 * @returns Promise with logout result
 */
export const logout = async (): Promise<{ success: boolean }> => {
  try {
    const response = await axios.post('/api/auth/logout', {}, {
      withCredentials: true,
    });
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false };
  }
};

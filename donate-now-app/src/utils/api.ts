// utils/api.ts
import { getAuthToken, removeAuthToken } from './auth';

type HeadersInit = Record<string, string>;

export const apiClient = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  
  // Initialize headers with proper typing
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as HeadersInit)
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`/api${url}`, {
      ...options,
      headers
    });
    
    if (response.status === 401) {
      // Token expired or invalid
      removeAuthToken();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
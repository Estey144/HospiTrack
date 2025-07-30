// Frontend/src/utils/api.js
const API_BASE_URL = 'http://localhost:8080/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Get user from localStorage
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// API call helper with automatic token inclusion
export const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Add Authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add credentials for CORS
  config.credentials = 'include';

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle 401 (unauthorized) - token might be expired
    if (response.status === 401) {
      console.warn('Token expired or invalid, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Handle different response types
    if (options.responseType === 'text') {
      return await response.text();
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Axios-style helper for backwards compatibility
export const axiosCompatible = {
  get: (url, config = {}) => {
    const endpoint = url.replace('http://localhost:8080/api', '').replace('http://localhost:8080', '');
    return apiCall(endpoint, { method: 'GET', ...config }).then(data => ({ data }));
  },
  post: (url, data, config = {}) => {
    const endpoint = url.replace('http://localhost:8080/api', '').replace('http://localhost:8080', '');
    return apiCall(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data),
      ...config 
    }).then(responseData => ({ data: responseData }));
  },
  put: (url, data, config = {}) => {
    const endpoint = url.replace('http://localhost:8080/api', '').replace('http://localhost:8080', '');
    return apiCall(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(data),
      ...config 
    }).then(responseData => ({ data: responseData }));
  },
  delete: (url, config = {}) => {
    const endpoint = url.replace('http://localhost:8080/api', '').replace('http://localhost:8080', '');
    return apiCall(endpoint, { method: 'DELETE', ...config }).then(data => ({ data }));
  }
};

// Logout helper
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

// Protected route wrapper
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    React.useEffect(() => {
      if (!isAuthenticated()) {
        window.location.href = '/login';
      }
    }, []);

    if (!isAuthenticated()) {
      return React.createElement('div', null, 'Redirecting to login...');
    }

    return React.createElement(WrappedComponent, props);
  };
};

export default apiCall;

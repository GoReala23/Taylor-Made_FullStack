import Api from './Api';

export const register = async (name, email, password) => {
  try {
    const response = await Api.register(name, email, password);
    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  console.log('Logging in with email:', email, 'and password:', password);
  try {
    if (!email || !password) {
      throw new Error('Both email and password are required');
    }
    const response = await Api.login(email, password);

    if (!response.token || !response.user) {
      throw new Error('Invalid response from server: Missing token or user');
    }
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const getCurrentUser = async (token) => {
  try {
    const response = await Api.getCurrentUser(token);

    if (response && response.user) {
      return response.user;
    }

    return response;
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};

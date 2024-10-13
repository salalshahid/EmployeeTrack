import apiClient from './apiClient';

export const signup = async (userData) => {
  try {
    // Create a new FormData object
    const formData = new FormData();

    // Append each key-value pair from userData to the FormData object
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    // Send the FormData object instead of the original userData
    const response = await apiClient.post('/users/signup/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set the content type to multipart/form-data
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data;
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await apiClient.post('/users/login/', { email, password });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data;
  }
};

export const changePassword = async (userData) => {
  try {
    const response = await apiClient.post('/users/change-password/', userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profile_picture', file);

    const response = await apiClient.patch('/users/profile-picture/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await apiClient.get('/users/');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const toggleUserStatus = async (userId, data) => {
  try {
    const response = await apiClient.patch(`/admin/toggle-account-status/${userId}/`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const changeUserRole = async (userId, data) => {
  try {
    console.log(data);
    const response = await apiClient.patch(`/admin/change-role/${userId}/`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const resetPasswordRequest = async (data) => {
  try {
    const response = await apiClient.post(`/users/password-reset-request/`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const signupRequest = async (data) => {
  try {
    const response = await apiClient.post(`/users/account-activation/`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const verifyOTP = async (data) => {
  try {    
    const response = await apiClient.post(`/users/verify-otp/`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const setNewPassword = async (data) => {
  try {
    const response = await apiClient.post(`/users/set-new-password/`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
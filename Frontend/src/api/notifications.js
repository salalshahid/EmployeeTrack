import apiClient from './apiClient';

export const fetchNotifications = async () => {
    try {
        const response = await apiClient.get('/notifications/');
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
}

export const remindEmployeeToSubmitLog = async (employeeId) => {
    try {
      const response = await apiClient.get(`/notifications/remind-employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('API error:', error.response);
      throw error.response.data;
    }
}
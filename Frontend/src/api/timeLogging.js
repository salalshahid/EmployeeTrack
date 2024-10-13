import apiClient from './apiClient';

export const logTime = async (data) => {
    try {
      const response = await apiClient.post('/time-entry/', data);
      return response.data;
    } catch (error) {
      console.error('API error:', error.response);
      throw error.response.data;
    }
};

export const editLog = async (logId, data) => {
  try {
    const response = await apiClient.patch(`/time-entry/${logId}/`, data);
    return response.data;
  } catch (error) {
    console.error('API error:', error.response);
    throw error.response.data;
  }
};

export const deleteLog = async (logId) => {
  try {
    const response = await apiClient.delete(`/time-entry/${logId}/`);
    return response.data;
  } catch (error) {
    console.error('API error:', error.response);
    throw error.response.data;
  }
};

export const fetchTimeLogs = async () => {
  try {
    const response = await apiClient.get('/time-entry/');
    return response.data;
  } catch (error) {
    console.error('API error:', error.response);
    throw error.response.data;
  }
};

export const remindEmployeeToSubmitLog = async (employeeId) => {
  try {
    const response = await apiClient.get(`/notifications/remind-employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error('API error:', error.response);
    throw error.response.data;
  }
}

export const fetchEmployeeLogs = async (data) => {
  apiClient.get(`/time-entry/pdf/${data.employeeId}/`, {
    params: {
      interval: data.interval,
    },
    responseType: 'blob', // This tells Axios to expect a binary response
  })
  .then(response => {
    // Check if the response is a Blob (optional, depending on if issues persist)
    if (response.data instanceof Blob) {
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'time-logs.pdf'); // Set a default filename for the download
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url); // Clean up the URL object
      link.parentNode.removeChild(link);
    } else {
      console.error("The server response is not a blob.");
    }
  })
  .catch(error => {
    console.error("Error downloading the file:", error);
  });
}
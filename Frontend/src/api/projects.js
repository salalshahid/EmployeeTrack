import apiClient from './apiClient';

export const createProject = async (data) => {
    try {
      console.log(data);
      const response = await apiClient.post('/project-management/projects/', data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
}

export const fetchAssignedProjects = async () => {
    try {
      const response = await apiClient.get('/project-management/projects/');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
}

export const fetchAllProjects = async () => {
  try {
    const response = await apiClient.get('/project-management/projects/all');
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const deleteProject = async (projectId) => {
  try {
    const response = await apiClient.delete(`/project-management/projects/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const fetchProjectData = async (projectId) => {
  try {
    const response = await apiClient.get(`/project-management/projects/${projectId}/`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const editProjectDetails = async (projectId, data) => {
  try {
    const response = await apiClient.put(`/project-management/projects/${projectId}/`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
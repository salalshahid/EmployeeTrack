import apiClient from './apiClient';

export const createTeam = async (data) => {
    try {
      const response = await apiClient.post('/team-management/teams/', data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
}

export const fetchTeams = async () => {
    try {
      const response = await apiClient.get('/team-management/teams/all/');
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
}

export const fetchTeamData = async (teamId) => {
  try {
    const response = await apiClient.get(`/team-management/teams/${teamId}/`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const deleteTeam = async (teamId) => {
  try {
    const response = await apiClient.delete(`/team-management/teams/${teamId}/`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

export const updateTeamData = async (teamId, data) => {
  try {
    const response = await apiClient.patch(`/team-management/teams/${teamId}/`, data);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}


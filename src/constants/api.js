const API_URL = process.env.REACT_APP_API_URL;

export const ENDPOINTS = {
  LOGIN: `${API_URL}/login`,
  SUBMIT_VOTE: (performanceId) => `${API_URL}/performances/${performanceId}/votes`,
  GET_PERFORMANCE: (id) => `${API_URL}/performances/${id}`,
  GET_ALL_PERFORMANCES: `${API_URL}/performances`,
  GET_VOTECOUNT: (id) => `${API_URL}/voteCount/${id}`,
  // Thêm các endpoints khác
}; 
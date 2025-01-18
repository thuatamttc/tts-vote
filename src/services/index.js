import { ENDPOINTS } from "../constants/api";
import Cookies from 'js-cookie';

export const submitVote = async (performanceId, score) => {
  try {
    const user = JSON.parse(Cookies.get('user'));
    const response = await fetch(
      ENDPOINTS.SUBMIT_VOTE(performanceId),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          user_id: user?.id,
          score: score 
        })
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Vote error:', error);
    throw error;
  }
};


export const getPerformances = async () => {
  try {
    const response = await fetch(ENDPOINTS.GET_ALL_PERFORMANCES, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching performances:', error);
    throw error;
  }
};


export const getVoteCount = async (performanceId) => {
  try {
    const response = await fetch(ENDPOINTS.GET_VOTECOUNT(performanceId), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching vote count:', error);
    throw error;
  }
};


export const getListCodeUser = async () => {
  try {
    const response = await fetch(ENDPOINTS.LIST_CODE_USER, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching list code user:', error);
    throw error;
  }
};

export const getUserByCode = async (code) => {
  try {
    const response = await fetch(ENDPOINTS.GET_USER_BY_CODE(code), {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};


export const getPerformancesRealtime = async () => {
  try {
    const response = await fetch(ENDPOINTS.GET_PERFORMANCES_REALTIME, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching performances:', error);
    throw error;
  }
};
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

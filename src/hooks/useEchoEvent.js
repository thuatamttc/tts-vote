import { useEffect, useState } from 'react';
import echo from '../echo';  // Import Echo instance

const useEchoEvent = (channelName, eventName) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Subscribe to channel
      const channel = echo.channel(channelName);
      
      // Listen for event
      channel.listen(eventName, (eventData) => {
        console.log(`${eventName} received:`, eventData);
        setData(eventData);
      });

      // Cleanup function
      return () => {
        channel.stopListening(eventName);
        echo.leaveChannel(channelName);
      };
    } catch (err) {
      console.error('Echo event error:', err);
      setError(err);
    }
  }, [channelName, eventName]);

  return { data, error };
};

export default useEchoEvent; 
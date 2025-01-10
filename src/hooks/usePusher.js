import { useState, useEffect } from "react";
import pusher from '../services/pusher';

const usePusherEvent = (channelName = 'my-channel', eventName = 'my-event') => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    try {
      // Subscribe to channel
      const channel = pusher.subscribe(channelName);

      // Bind to event
      channel.bind(eventName, function(receivedData) {
        console.log('Received data:', receivedData);
        setData(receivedData);
      });

      // Handle connection states
      pusher.connection.bind('connected', () => {
        console.log('Connected to Pusher');
        setIsConnected(true);
      });

      pusher.connection.bind('disconnected', () => {
        console.log('Disconnected from Pusher');
        setIsConnected(false);
      });

      // Cleanup on unmount
      return () => {
        channel.unbind(eventName);
        pusher.unsubscribe(channelName);
      };
    } catch (error) {
      console.error('Pusher error:', error);
    }
  }, [channelName, eventName]);

  return {
    data,
    isConnected
  };
};

export default usePusherEvent;
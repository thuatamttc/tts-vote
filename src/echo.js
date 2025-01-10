import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Kết nối Laravel Echo với server Soketi
window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "app-key", // Thay bằng PUSHER_APP_KEY
  cluster: "mt1", // Thay bằng PUSHER_APP_CLUSTER
  wsHost: "test.cmsfuture.online", // Thay bằng PUSHER_HOST
  wsPort: 6001, // Nếu dùng WebSocket không bảo mật
  wssPort: 443, // Port HTTPS mặc định
  forceTLS: true, // Kết nối qua HTTPS
  enabledTransports: ["ws", "wss"], // Sử dụng WebSocket
});

export default echo;

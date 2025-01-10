import Pusher from "pusher-js";

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

const pusher = new Pusher("6016afb0342b3472d34c", {
  cluster: "ap1",
});

export default pusher;

import { io } from "socket.io-client";
const socket = io("http://localhost:5000"); // Change URL if backend hosted elsewhere
export default socket;

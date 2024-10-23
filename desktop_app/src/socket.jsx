import io from 'socket.io-client';

// Đảm bảo URL chính xác
export const socket = io('http://localhost:5000', {
    transports: ['websocket'],  // Đảm bảo rằng bạn đang sử dụng giao thức WebSocket
});

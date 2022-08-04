import { io as ioClient } from 'socket.io-client';

export function io(uri: string) {
  return ioClient(uri, {
    transports: ['websocket'],
    autoConnect: false,
  });
}

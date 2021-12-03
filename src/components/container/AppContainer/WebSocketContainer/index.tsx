import { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { useGameLog, useGameState } from '~/data';

const WebSocketContainer = () => {
  const [gameLog, setGameLog] = useGameLog();
  const [, setGameState] = useGameState();

  const socketUrl = `ws://127.0.0.1:8765/`;

  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    reconnectAttempts: Infinity,
    reconnectInterval: 1000 * 10,
  });

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      fetch('/getState')
        .then((res) => res.json())
        .then((res) => {
          setGameState(res);
        });
    }
  }, [readyState]);

  useEffect(() => {
    if (lastMessage) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.readyState === 2) {
          const enc = new TextDecoder('utf-8');

          const res = JSON.parse(
            enc.decode(new Uint8Array(e.target.result as ArrayBuffer))
          );

          if (res.type === 'update-state') {
            setGameState(res.data);
          }

          if (res.type === 'push-log-message') {
            setGameLog([[res.time, res.data], ...(gameLog || [])]);
          }
        }
      };

      reader.readAsArrayBuffer(lastMessage.data);
    }
  }, [lastMessage]);

  return null;
};

export default WebSocketContainer;

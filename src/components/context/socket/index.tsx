import React, {
  FC,
  ReactElement,
  createContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { useSnackbar } from 'notistack';

import {
  useGameLog,
  useGameSettings,
  useGameSettingsByKey,
  useGameState,
} from '~/data';

export type SocketContextProps = {
  sendMessage: (type: string, data?: unknown) => void;
  connected: boolean;
};

const SocketContext = createContext<SocketContextProps>(
  {} as SocketContextProps
);

const SocketContextProvider: FC = ({ children }): ReactElement => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [gameLog, setGameLog] = useGameLog();
  const [gameSettings, setGameSettings] = useGameSettings();
  const [, setGameState] = useGameState();

  const server = useGameSettingsByKey('server');

  const socketUrl = useMemo(
    () => (server ? `ws://${server}/websocket` : null),
    [server]
  );

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    reconnectAttempts: Infinity,
    reconnectInterval: 1000 * 10,
  });

  const sendMessage = useCallback(
    (type: string, data?: unknown) => {
      sendJsonMessage({
        type,
        data,
      });
    },
    [sendJsonMessage]
  );

  const connected = useMemo(() => readyState === ReadyState.OPEN, [readyState]);

  useEffect(() => {
    if (connected) {
      sendJsonMessage({
        type: 'getState',
      });

      sendJsonMessage({
        type: 'getLogArray',
      });

      closeSnackbar('socket');
    } else {
      enqueueSnackbar('无法连接到服务器', {
        key: 'socket',
        variant: 'error',
        persist: true,
        preventDuplicate: true,
      });
    }
  }, [connected]);

  useEffect(() => {
    if (lastMessage) {
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target && e.target.readyState === 2) {
          const enc = new TextDecoder('utf-8');

          const res = JSON.parse(
            enc.decode(new Uint8Array(e.target.result as ArrayBuffer))
          );

          if (res.type === 'getState_ACK' || res.type === 'onStateUpdate') {
            setGameState(res.data);
          }

          if (res.type === 'getLogArray_ACK') {
            setGameLog(res.data.reverse());
          }

          if (res.type === 'onLogAppend') {
            setGameLog([res.data, ...(gameLog || [])]);
          }
        }
      };

      reader.readAsArrayBuffer(lastMessage.data);
    }
  }, [lastMessage]);

  useEffect(() => {
    if (window && gameSettings) {
      setGameSettings({
        ...gameSettings,
        server: window.location.host,
      });
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        sendMessage,
        connected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;

export { SocketContext };

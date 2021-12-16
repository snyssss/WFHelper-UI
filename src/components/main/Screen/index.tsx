import React, {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import useWebSocket from 'react-use-websocket';

import LoadingSpinner from '~/components/common/LoadingSpinner';
import LoadProvider, { LoadContext } from '~/components/context/load';
import { SocketContext } from '~/components/context/socket';
import { useGameSettingsByKey } from '~/data';

const Container: FC = ({ children }) => {
  const { connected } = useContext(SocketContext);

  return (
    <LoadProvider loading={connected === false}>
      <LoadContext.Consumer>
        {({ loading }) => (loading ? <LoadingSpinner /> : <>{children}</>)}
      </LoadContext.Consumer>
    </LoadProvider>
  );
};

const Component = (): ReactElement => {
  const ref = useRef<HTMLCanvasElement | null>(null);

  const server = useGameSettingsByKey('server');

  const { sendMessage } = useContext(SocketContext);

  const [socketUrl, setSocketUrl] = useState<string | null>(null);

  const { lastMessage } = useWebSocket(socketUrl, {
    reconnectAttempts: Infinity,
    reconnectInterval: 1000 * 10,
  });

  useEffect(() => {
    if (server) {
      setSocketUrl(`ws://${server}/stream`);
    } else {
      setSocketUrl(null);
    }

    return () => {
      setSocketUrl(null);
    };
  }, [server]);

  const touchScreen = (x: number, y: number) => {
    if (ref && ref.current) {
      const canvas = ref.current;
      const ctx = canvas.getContext('2d');

      if (canvas.style.cursor !== 'not-allowed') {
        canvas.style.cursor = 'not-allowed';

        if (ctx) {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.beginPath();
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }

        sendMessage('touchScreen', {
          x,
          y,
        });
      }
    }
  };

  const swipeScreen = (x1: number, y1: number, x2: number, y2: number) => {
    if (ref && ref.current) {
      const canvas = ref.current;
      const ctx = canvas.getContext('2d');

      if (canvas.style.cursor !== 'not-allowed') {
        canvas.style.cursor = 'not-allowed';

        if (ctx) {
          ctx.globalCompositeOperation = 'destination-out';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.beginPath();
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fill();
          ctx.globalCompositeOperation = 'source-over';
        }

        sendMessage('swipeScreen', {
          x1,
          y1,
          x2,
          y2,
        });
      }
    }
  };

  useEffect(() => {
    if (ref && ref.current) {
      const canvas = ref.current;

      const Mouse = {
        x: 0,
        y: 0,
        mousedown: (e: MouseEvent) => {
          Mouse.x = e.clientX;
          Mouse.y = e.clientY;
        },
        mouseup: (e: MouseEvent) => {
          if (Mouse.x && Mouse.y) {
            if (
              Math.abs(e.clientX - Mouse.x) > 10 ||
              Math.abs(e.clientY - Mouse.y) > 10
            ) {
              const rect = canvas.getBoundingClientRect();
              const x1 = Mouse.x - rect.left;
              const y1 = Mouse.y - rect.top;
              const x2 = e.clientX - rect.left;
              const y2 = e.clientY - rect.top;

              swipeScreen(x1, y1, x2, y2);
            } else {
              const rect = canvas.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;

              touchScreen(x, y);
            }
          }

          Mouse.x = 0;
          Mouse.y = 0;
        },
      };

      canvas.addEventListener('mousedown', Mouse.mousedown);
      canvas.addEventListener('mouseup', Mouse.mouseup);
      canvas.addEventListener('mouseleave', Mouse.mouseup);
    }
  }, [ref]);

  useEffect(() => {
    if (ref && ref.current && lastMessage) {
      const canvas = ref.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.src = URL.createObjectURL(lastMessage.data);
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.style.cursor = 'auto';

        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }

        URL.revokeObjectURL(img.src);
      };
    }
  }, [ref, lastMessage]);

  return (
    <Container>
      <canvas ref={ref} />
    </Container>
  );
};

export default Component;

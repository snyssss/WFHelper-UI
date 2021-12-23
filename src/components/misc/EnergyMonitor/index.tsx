import { ReactElement, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import { useDebounceFn } from 'ahooks';
import Tesseract from 'tesseract.js';

import { useEnergy, useGameSettingsByKey } from '~/data';

const Component = (): ReactElement | null => {
  const server = useGameSettingsByKey('server');

  const [socketUrl, setSocketUrl] = useState<string | null>(null);

  const { lastMessage } = useWebSocket(socketUrl);

  const [, setEnergy] = useEnergy();

  const { run } = useDebounceFn(
    () => {
      if (server) {
        setSocketUrl(`ws://${server}/stream`);
      } else {
        setSocketUrl(null);
      }
    },
    {
      wait: 1000,
    }
  );

  useEffect(() => {
    run();

    return () => {
      setSocketUrl(null);
    };
  }, [server]);

  useEffect(() => {
    if (lastMessage) {
      setSocketUrl(null);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.src = URL.createObjectURL(lastMessage.data);
      img.onload = () => {
        canvas.width = 70;
        canvas.height = 30;

        if (ctx) {
          ctx.drawImage(
            img,
            120,
            20,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
          );
        }

        URL.revokeObjectURL(img.src);

        Tesseract.recognize(canvas.toDataURL(), 'eng').then(
          ({ data: { text } }) => {
            if (/^\d{1,2}\/\d{2}$/.test(text.trim())) {
              setEnergy(text.trim());
            }

            run();
          }
        );
      };
    }
  }, [lastMessage]);

  return null;
};

export default Component;

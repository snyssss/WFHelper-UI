/* eslint-disable no-param-reassign, prefer-destructuring */
import { ReactElement, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import { useDebounceFn } from 'ahooks';
import Tesseract from 'tesseract.js';

import { useEnergy, useGameSettingsByKey } from '~/data';

const changeColor = (
  imageData: ImageData,
  sourceColor: [number, number, number],
  targetColor: [number, number, number],
  threshold: number
) => {
  for (let i = 0; i < imageData.data.length; i += 4) {
    if (
      Math.abs(imageData.data[i] - sourceColor[0]) < threshold &&
      Math.abs(imageData.data[i + 1] - sourceColor[1]) < threshold &&
      Math.abs(imageData.data[i + 2] - sourceColor[2]) < threshold
    ) {
      imageData.data[i] = targetColor[0];
      imageData.data[i + 1] = targetColor[1];
      imageData.data[i + 2] = targetColor[2];
    }
  }
};

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
      wait: 1000 * 60,
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
        canvas.width = 80;
        canvas.height = 50;

        if (ctx) {
          ctx.drawImage(
            img,
            120,
            10,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          changeColor(imageData, [247, 251, 247], [49, 53, 49], 2);
          changeColor(imageData, [255, 158, 25], [49, 53, 49], 64);

          ctx.putImageData(imageData, 0, 0);
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

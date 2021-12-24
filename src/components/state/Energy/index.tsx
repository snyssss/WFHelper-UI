import React, { ReactElement, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';

import {
  Box,
  LinearProgress,
  Paper,
  Typography,
  paperClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useInterval } from 'ahooks';

import { useGameSettingsByKey, useGameStateByKey } from '~/data';

const StyledPaper = styled(Paper)(() => ({
  [`&.${paperClasses.root}`]: {
    display: 'inline-flex',
  },
}));

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  width: theme.spacing(24),
}));

const getColorPercentage = (
  imageData: ImageData,
  targetColor: [number, number, number],
  threshold: number
) => {
  let result = 0;

  for (let i = 0; i < imageData.data.length; i += 4) {
    if (
      Math.abs(imageData.data[i] - targetColor[0]) < threshold &&
      Math.abs(imageData.data[i + 1] - targetColor[1]) < threshold &&
      Math.abs(imageData.data[i + 2] - targetColor[2]) < threshold
    ) {
      result += 1;
    }
  }

  return Math.round((result / (imageData.data.length / 4)) * 100);
};

const Component = (): ReactElement => {
  const server = useGameSettingsByKey('server');

  const [energy, setEnergy] = useState(0);

  const [socketUrl, setSocketUrl] = useState<string | null>(null);

  const { lastMessage, getWebSocket } = useWebSocket(socketUrl);

  useInterval(() => {
    if (server) {
      setSocketUrl(`ws://${server}/stream`);
    } else {
      setSocketUrl(null);
    }
  }, 1000 * 10);

  useEffect(() => {
    return () => {
      setSocketUrl(null);
    };
  }, []);

  useEffect(() => {
    if (lastMessage) {
      const socket = getWebSocket();

      if (socket) {
        socket.close();
      }

      setSocketUrl(null);

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.src = URL.createObjectURL(lastMessage.data);
      img.onload = () => {
        canvas.width = 307;
        canvas.height = 1;

        if (ctx) {
          ctx.drawImage(
            img,
            95,
            23,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
          );

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          const e = getColorPercentage(imageData, [255, 158, 25], 2);
          const b = getColorPercentage(imageData, [49, 53, 49], 2);

          if (e + b === 100) {
            setEnergy(e);
          }

          URL.revokeObjectURL(img.src);
        }
      };
    }
  }, [lastMessage]);

  return (
    <StyledPaper>
      <StyledBox>
        <Typography variant="h6">体力</Typography>
        <LinearProgress
          variant="determinate"
          color={energy < 100 ? 'primary' : 'secondary'}
          value={energy}
        />
      </StyledBox>
    </StyledPaper>
  );
};

const Container = (): ReactElement | null => {
  const enhanced = useGameStateByKey('铃铛设置');

  if (enhanced) {
    return <Component />;
  }

  return null;
};

export default Container;

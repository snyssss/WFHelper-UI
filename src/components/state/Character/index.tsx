import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import useWebSocket from 'react-use-websocket';

import {
  Box,
  LinearProgress,
  LinearProgressProps,
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
  justifyContent: 'space-evenly',
  padding: theme.spacing(2),
  width: theme.spacing(24),
}));

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: theme.spacing(1),
}));

const LinearProgressWithLabel = ({
  label,
  ...props
}: LinearProgressProps & { label: string }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="body2" noWrap>
        {label}
      </Typography>
      <Box sx={{ flex: 1, mx: 1 }}>
        <StyledLinearProgress variant="determinate" {...props} />
      </Box>
      {props.value !== undefined && props.value >= 0 && (
        <Typography variant="caption" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      )}
    </Box>
  );
};

const getColorPercentage = (
  imageData: ImageData,
  targetColor: [number, number, number],
  threshold: number
) => {
  let result = 0;

  for (let i = 0; i < imageData.data.length; i += 4) {
    if (
      Math.abs(imageData.data[i] - targetColor[0]) <= threshold &&
      Math.abs(imageData.data[i + 1] - targetColor[1]) <= threshold &&
      Math.abs(imageData.data[i + 2] - targetColor[2]) <= threshold
    ) {
      result += 1;
    }
  }

  return result / (imageData.data.length / 4);
};

const getEnergy = (
  img: HTMLImageElement,
  callback: Dispatch<SetStateAction<number>>
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

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

    if (e + b === 1) {
      callback(Math.round(e * 1000) / 10);
    }
  }
};

const getExp = (
  img: HTMLImageElement,
  callback: Dispatch<SetStateAction<number>>
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 92;
  canvas.height = 92;

  if (ctx) {
    ctx.drawImage(
      img,
      0,
      104,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const radius = 90;
    const radiusPerDegree = Math.PI / radius;

    const data = {
      left: 0,
      right: 0,
    };

    for (let i = 0; i <= 90; i += 1) {
      const x = Math.round(Math.cos(i * radiusPerDegree) * radius);
      const y = Math.round(Math.sin(i * radiusPerDegree) * radius);

      if (x >= 0 && y >= 0) {
        const n = canvas.width * 4 * x + y * 4;

        if (
          imageData.data[n] === 49 &&
          imageData.data[n + 1] === 194 &&
          imageData.data[n + 2] === 181
        ) {
          data.left += 1;
        } else if (
          imageData.data[n] === 49 &&
          imageData.data[n + 1] === 53 &&
          imageData.data[n + 2] === 49
        ) {
          data.right += 1;
        } else {
          return;
        }
      }
    }

    callback(
      Math.round((data.left / (data.left + data.right || 1)) * 1000) / 10
    );
  }
};

const Component = (): ReactElement => {
  const current = useGameStateByKey('当前铃铛');

  const server = useGameSettingsByKey('server');

  const [energy, setEnergy] = useState(-1);
  const [exp, setExp] = useState(-1);

  const [socketUrl, setSocketUrl] = useState<string | null>(null);

  const { lastMessage, getWebSocket } = useWebSocket(socketUrl);

  const run = useCallback(() => {
    if (JSON.stringify(current) !== '{}') {
      return;
    }

    if (server) {
      setSocketUrl(`ws://${server}/stream`);
    } else {
      setSocketUrl(null);
    }
  }, [current, server]);

  useInterval(run, 1000 * 10);

  useEffect(() => {
    run();

    return () => {
      setSocketUrl(null);
    };
  }, [run]);

  useEffect(() => {
    if (lastMessage) {
      const socket = getWebSocket();

      if (socket) {
        socket.close();
      }

      setSocketUrl(null);

      const img = new Image();

      img.src = URL.createObjectURL(lastMessage.data);
      img.onload = () => {
        getEnergy(img, setEnergy);
        getExp(img, setExp);

        URL.revokeObjectURL(img.src);
      };
    }
  }, [lastMessage]);

  return (
    <StyledPaper>
      <StyledBox>
        <LinearProgressWithLabel
          label="体力"
          variant={energy < 0 ? 'indeterminate' : 'determinate'}
          color={energy < 100 ? 'primary' : 'secondary'}
          value={energy}
        />
        <LinearProgressWithLabel
          label="经验"
          variant={exp < 0 ? 'indeterminate' : 'determinate'}
          color={exp < 100 ? 'primary' : 'secondary'}
          value={exp}
        />
      </StyledBox>
    </StyledPaper>
  );
};

const Container = (): ReactElement | null => {
  const enhanced = useGameStateByKey('当前铃铛');

  if (enhanced) {
    return <Component />;
  }

  return null;
};

export default Container;

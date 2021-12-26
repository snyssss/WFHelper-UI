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

const energyColor = [255, 158, 25];
const expColor = [49, 194, 181];
const backgroundColor = [49, 53, 49];

const getEnergy = (
  img: HTMLImageElement,
  callback: Dispatch<SetStateAction<number>>
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (img.width === 720 && img.height === 1280) {
      canvas.width = 307;
      canvas.height = 1;

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
    } else if (img.width === 810 && img.height === 1440) {
      canvas.width = 344;
      canvas.height = 1;

      ctx.drawImage(
        img,
        107,
        26,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } else {
      return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const data = {
      left: 0,
      right: 0,
    };

    for (let n = 0; n < imageData.data.length; n += 4) {
      if (
        imageData.data[n] === energyColor[0] &&
        imageData.data[n + 1] === energyColor[1] &&
        imageData.data[n + 2] === energyColor[2]
      ) {
        data.left += 1;
      } else if (
        imageData.data[n] === backgroundColor[0] &&
        imageData.data[n + 1] === backgroundColor[1] &&
        imageData.data[n + 2] === backgroundColor[2]
      ) {
        data.right += 1;
      } else {
        return;
      }
    }

    callback(
      Math.round((data.left / (data.left + data.right || 1)) * 1000) / 10
    );
  }
};

const getExp = (
  img: HTMLImageElement,
  callback: Dispatch<SetStateAction<number>>
) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (ctx) {
    if (img.width === 720 && img.height === 1280) {
      canvas.width = 92;
      canvas.height = 92;

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
    } else if (img.width === 810 && img.height === 1440) {
      canvas.width = 102;
      canvas.height = 102;

      ctx.drawImage(
        img,
        0,
        117,
        canvas.width,
        canvas.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    } else {
      return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const radius = canvas.width - 2;
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
          imageData.data[n] === expColor[0] &&
          imageData.data[n + 1] === expColor[1] &&
          imageData.data[n + 2] === expColor[2]
        ) {
          data.left += 1;
        } else if (
          imageData.data[n] === backgroundColor[0] &&
          imageData.data[n + 1] === backgroundColor[1] &&
          imageData.data[n + 2] === backgroundColor[2]
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
        <Typography
          variant="caption"
          color="text.secondary"
        >{`${props.value}%`}</Typography>
      )}
    </Box>
  );
};

const Component = (): ReactElement => {
  const current = useGameStateByKey('当前铃铛');

  const server = useGameSettingsByKey('server');

  const [energy, setEnergy] = useState(-1);
  const [exp, setExp] = useState(-1);

  const [socketUrl, setSocketUrl] = useState<string | null>(null);

  const { lastMessage, getWebSocket } = useWebSocket(socketUrl);

  const run = useCallback(() => {
    if (current && JSON.stringify(current) !== '{}') {
      return;
    }

    if (server) {
      setSocketUrl(`ws://${server}/stream`);
    } else {
      setSocketUrl(null);
    }
  }, [current, server]);

  useInterval(run, 1000 * 10, { immediate: true });

  useEffect(() => {
    if (lastMessage) {
      const socket = getWebSocket();

      if (socket) {
        socket.close();
      }

      const img = new Image();

      img.src = URL.createObjectURL(lastMessage.data);
      img.onload = () => {
        getEnergy(img, setEnergy);
        getExp(img, setExp);

        URL.revokeObjectURL(img.src);
      };

      setSocketUrl(null);
    }

    return () => {
      setSocketUrl(null);
    };
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

export default Component;

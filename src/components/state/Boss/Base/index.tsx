import React, { ReactElement, useMemo } from 'react';

import {
  Accordion,
  AccordionSummary,
  Box,
  Chip,
  Typography,
} from '@mui/material';

import { useGameState, useGameStateByKey } from '~/data';

export interface ComponentProps {
  name: string;
}

const Summary = ({ name }: ComponentProps): ReactElement => {
  const [gameState] = useGameState();

  const currentBoss = useGameStateByKey('正在挑战的boss');

  const data: Record<string, unknown> = Object.entries(
    gameState as Record<string, unknown>
  )
    .filter(([key]) => key.indexOf(name) === 0)
    .reduce((root, [key, value]) => {
      return {
        ...root,
        [key]: value,
      };
    }, {});

  const count = useMemo(() => Number(data[name]), [JSON.stringify(data)]);

  const level = useMemo(() => {
    if (currentBoss) {
      if (String(currentBoss).indexOf(name) === 0) {
        return <Chip color="primary" size="small" label="战斗中" />;
      }
    }

    return null;
  }, [currentBoss]);

  return (
    <AccordionSummary
      sx={level ? { background: (theme) => theme.palette.secondary.light } : {}}
    >
      <Typography sx={{ width: 180, flexShrink: 0 }}>{name}</Typography>
      <Typography
        sx={{
          flex: 1,
          color: 'text.secondary',
        }}
      >
        {count}
      </Typography>
      <Box sx={{ width: 80 }}>{level}</Box>
    </AccordionSummary>
  );
};

const Component = ({ name }: ComponentProps): ReactElement => {
  return (
    <Accordion>
      <Summary name={name} />
    </Accordion>
  );
};

export default Component;

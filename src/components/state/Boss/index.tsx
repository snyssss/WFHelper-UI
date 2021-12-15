import React, { ReactElement, useCallback, useContext, useMemo } from 'react';

import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';

import { SocketContext } from '~/components/context/socket';
import { useGameState, useGameStateByKey } from '~/data';

export interface ComponentProps {
  name: string;
  levels: string[];
}

export interface ComponentChildProps {
  name: string;
  level: string;
}

const Summary = ({ name }: Pick<ComponentChildProps, 'name'>): ReactElement => {
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

  const count = useMemo(() => {
    if (data[name] && String(data[name]).indexOf('0b') < 0) {
      return Number(data[name]);
    }

    return Object.entries(data).reduce((accumulator, [key, value]) => {
      return accumulator + (key === name ? 0 : Number(value));
    }, 0);
  }, [JSON.stringify(data)]);

  const level = useMemo(() => {
    if (currentBoss) {
      if (String(currentBoss).indexOf(name) === 0) {
        const splitArray = String(currentBoss).split(' ');

        if (splitArray.length > 1) {
          return (
            <Chip
              color="primary"
              size="small"
              label={splitArray[splitArray.length - 1]}
            />
          );
        }

        return <Chip color="primary" size="small" label="战斗中" />;
      }
    }

    return null;
  }, [currentBoss]);

  return (
    <AccordionSummary
      expandIcon={<ExpandMore />}
      sx={level ? { background: (theme) => theme.palette.secondary.light } : {}}
    >
      <Typography sx={{ width: '40%', flexShrink: 0 }}>{name}</Typography>
      <Typography sx={{ width: '40%', color: 'text.secondary' }}>
        {count}
      </Typography>
      {level}
    </AccordionSummary>
  );
};

const ItemLabel = ({ name, level }: ComponentChildProps): ReactElement => {
  const count = useGameStateByKey(`${name} - ${level}`);

  return (
    <Box display="flex">
      <Typography sx={{ width: '40%', flexShrink: 0 }}>{level}</Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        {String(count || '')}
      </Typography>
    </Box>
  );
};

const Component = ({ name, levels }: ComponentProps): ReactElement => {
  const { sendMessage } = useContext(SocketContext);

  const switches = useGameStateByKey(name);

  const checked = useMemo(() => {
    if (switches) {
      if (String(switches).indexOf('0b') === 0) {
        return levels.map((item, index) => [
          item,
          Number(String(switches)[index + 2]) || 0,
        ]);
      }
    }

    return levels.map((item) => [item, 0]);
  }, [switches]);

  const isChecked = useCallback(
    (level: string) =>
      checked.findIndex(([key, value]) => key === level && value > 0) >= 0,
    [checked]
  );

  const handleToggle = useCallback(
    (level: string) => () => {
      const r = checked.reduce((root, [key, value]) => {
        if (key === level) {
          return root + Math.abs(Number(value) - 1);
        }

        return root + Number(value);
      }, '0b');

      sendMessage('setState', {
        key: name,
        value: r,
      });
    },
    [checked, sendMessage]
  );

  return (
    <Accordion>
      <Summary name={name} />
      <Divider />
      <AccordionDetails sx={{ p: 1 }}>
        <List sx={{ p: 0, width: '100%', bgcolor: 'background.paper' }}>
          {['超级', '高级+', '高级', '中级', '初级'].map((value) => {
            const hasSwitch = levels.includes(value);

            return (
              <ListItem
                key={value}
                secondaryAction={
                  hasSwitch && (
                    <Checkbox
                      edge="end"
                      onChange={handleToggle(value)}
                      checked={isChecked(value)}
                    />
                  )
                }
                disablePadding
              >
                <ListItemButton
                  onClick={handleToggle(value)}
                  disabled={hasSwitch === false}
                >
                  <ListItemText
                    primary={<ItemLabel name={name} level={value} />}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default Component;

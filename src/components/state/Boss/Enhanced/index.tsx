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
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Theme,
  Typography,
} from '@mui/material';

import { SocketContext } from '~/components/context/socket';
import { useGameStateByKey } from '~/data';
import { BossInfo, BossName, GameState } from '~/data/useGameState';

export interface ComponentProps {
  name: string;
}

const PartyMap = {
  默认: '',
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
  F: 'F',
  G: 'G',
  H: 'H',
  I: 'I',
  J: 'J',
};

const Summary = ({ name }: ComponentProps): ReactElement => {
  const settings = useGameStateByKey('铃铛设置') as GameState['铃铛设置'];

  const counter = useGameStateByKey('铃铛计数') as Record<BossName, number>;

  const current = useGameStateByKey('当前铃铛') as BossInfo;

  const count = useMemo(() => {
    if (counter) {
      return Object.entries(settings[name]).reduce(
        (accumulator, [_, info]) => accumulator + (counter[info.name] || 0),
        0
      );
    }

    return 0;
  }, [settings, current, counter]);

  const level = useMemo(() => {
    const result = Object.entries(settings[name]).find(
      ([_, info]) => info.name === current.name
    );

    if (result) {
      return <Chip color="primary" size="small" label={result[0]} />;
    }

    return null;
  }, [settings, current]);

  const enabled = useMemo(
    () => Object.entries(settings[name]).find(([_, info]) => info.enabled),
    [settings]
  );

  const background = useMemo(() => {
    if (level) {
      return (theme: Theme) => theme.palette.secondary.light;
    }

    if (enabled === undefined) {
      return (theme: Theme) => theme.palette.grey[400];
    }

    return undefined;
  }, [level, enabled]);

  return (
    <AccordionSummary expandIcon={<ExpandMore />} sx={{ background }}>
      <Typography sx={{ width: 150, flexShrink: 0 }}>{name}</Typography>
      <Typography
        sx={{
          flex: 1,
          color: 'text.secondary',
        }}
      >
        {count}
      </Typography>
      <Box sx={{ width: 80, textAlign: 'center', mr: 1 }}>{level}</Box>
    </AccordionSummary>
  );
};

const Component = ({ name }: ComponentProps): ReactElement | null => {
  const { sendMessage } = useContext(SocketContext);

  const settings = useGameStateByKey('铃铛设置') as GameState['铃铛设置'];

  const counter = useGameStateByKey('铃铛计数') as Record<BossName, number>;

  const handleToggleEnabled = useCallback(
    (level: string, enabled: boolean) => () => {
      sendMessage('mergeConfigSettings', {
        铃铛设置: {
          [name]: {
            [level]: {
              enabled: !enabled,
            },
          },
        },
      });
    },
    [name, settings, sendMessage]
  );

  const handleChangeParty = useCallback(
    (level: string) => (event: SelectChangeEvent) => {
      sendMessage('mergeConfigSettings', {
        铃铛设置: {
          [name]: {
            [level]: {
              party: event.target.value as string,
            },
          },
        },
      });
    },
    [name, settings, sendMessage]
  );

  const handleCancel = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  };

  if (settings[name]) {
    return (
      <Accordion>
        <Summary name={name} />
        <Divider />
        <AccordionDetails sx={{ p: 1 }}>
          <List sx={{ p: 0, width: '100%', bgcolor: 'background.paper' }}>
            {Object.entries(settings[name]).map(([level, info]) => {
              const { name: key, party, enabled } = info;

              return (
                <ListItem
                  key={key}
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      onChange={handleToggleEnabled(level, enabled)}
                      checked={enabled}
                    />
                  }
                  disablePadding
                >
                  <ListItemButton
                    sx={{ pl: 1 }}
                    onClick={handleToggleEnabled(level, enabled)}
                  >
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Typography sx={{ width: 150, flexShrink: 0 }}>
                            {level}
                          </Typography>
                          <Typography
                            sx={{
                              flex: 1,
                              color: 'text.secondary',
                            }}
                          >
                            {counter ? counter[key] : ''}
                          </Typography>
                          <FormControl size="small" sx={{ width: 80 }}>
                            <InputLabel shrink>队伍</InputLabel>
                            <Select
                              input={<OutlinedInput notched label="队伍" />}
                              value={party}
                              onClick={handleCancel}
                              onChange={handleChangeParty(level)}
                              displayEmpty
                            >
                              {Object.entries(PartyMap).map(
                                ([label, value]) => (
                                  <MenuItem key={label} value={value}>
                                    {label}
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    );
  }

  return null;
};

export default Component;

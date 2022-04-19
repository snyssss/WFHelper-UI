import React, {
  ChangeEvent,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup,
  Theme,
  Typography,
} from '@mui/material';

import { SocketContext } from '~/components/context/socket';
import { useGameStateByKey } from '~/data';
import { BossInfo, BossName, GameState } from '~/data/useGameState';

export interface ComponentProps {
  name: string;
}

export interface PartySelctorProps {
  active: [string, string, BossInfo] | null;
  onClose: () => void;
}

const PartySelector = ({
  active,
  onClose,
}: PartySelctorProps): ReactElement | null => {
  const { sendMessage } = useContext(SocketContext);

  const [setValue, setSetValue] = useState('');
  const [partyValue, setPartyValue] = useState('');

  useEffect(() => {
    if (active) {
      const { set, party } = active[2];

      setSetValue(set || '');
      setPartyValue(party || '');
    }
  }, [active]);

  const handleChangeSet = (event: ChangeEvent<HTMLInputElement>) => {
    setSetValue((event.target as HTMLInputElement).value);
  };

  const handleChangeParty = (event: ChangeEvent<HTMLInputElement>) => {
    setPartyValue((event.target as HTMLInputElement).value);
  };

  const handleReset = () => {
    if (active) {
      const [name, level] = active;

      sendMessage('mergeConfigSettings', {
        铃铛设置: {
          [name]: {
            [level]: {
              set: ``,
              party: ``,
            },
          },
        },
      });

      onClose();
    }
  };

  const handleOK = () => {
    if (active && setValue && partyValue) {
      const [name, level] = active;

      sendMessage('mergeConfigSettings', {
        铃铛设置: {
          [name]: {
            [level]: {
              set: setValue,
              party: partyValue,
            },
          },
        },
      });

      onClose();
    }
  };

  if (active) {
    return (
      <Dialog maxWidth="lg" fullWidth open>
        <DialogTitle>队伍选择</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <FormLabel>SET</FormLabel>
            <RadioGroup row value={setValue} onChange={handleChangeSet}>
              {[...new Array(6)].map((_, index) => (
                <FormControlLabel
                  key={index}
                  value={index + 1}
                  control={<Radio />}
                  label={`${index + 1}`}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormControl fullWidth>
            <FormLabel>队伍</FormLabel>
            <RadioGroup row value={partyValue} onChange={handleChangeParty}>
              {[...new Array(10)].map((_, index) => (
                <FormControlLabel
                  key={index}
                  value={index + 1}
                  control={<Radio />}
                  label={`${index + 1}`}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReset}>默认</Button>
          <Button onClick={onClose}>取消</Button>
          <Button onClick={handleOK}>确定</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return null;
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

  const [active, setActive] = useState<[string, string, BossInfo] | null>(null);

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
    (level: string, info: BossInfo) => (e: { stopPropagation: () => void }) => {
      e.stopPropagation();

      setActive([name, level, info]);
    },
    [name, settings, sendMessage]
  );

  const handleClose = () => {
    setActive(null);
  };

  if (settings[name]) {
    return (
      <Accordion>
        <Summary name={name} />
        <Divider />
        <AccordionDetails sx={{ p: 1 }}>
          <List sx={{ p: 0, width: '100%', bgcolor: 'background.paper' }}>
            {Object.entries(settings[name]).map(([level, info]) => {
              const { name: key, set, party, enabled } = info;

              const label = set && party ? `${set}-${party}` : '默认';

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
                          <Chip
                            color="primary"
                            size="small"
                            label={label}
                            onClick={handleChangeParty(level, info)}
                          />
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </AccordionDetails>
        <PartySelector active={active} onClose={handleClose} />
      </Accordion>
    );
  }

  return null;
};

const Container = (): ReactElement => {
  const settings = useGameStateByKey('铃铛设置') as GameState['铃铛设置'];

  return (
    <>
      {Object.keys(settings || {}).map((item) => (
        <Grid key={item} item xs={4}>
          <Component name={item} />
        </Grid>
      ))}
    </>
  );
};

export default Container;

import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';

import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material';

import { useGameSettings, useGameSettingsByKey } from '~/data';

const Server = (): ReactElement | null => {
  const [gameSettings, setGameSettings] = useGameSettings();

  const server = useGameSettingsByKey('server');

  const [value, setValue] = useState('');

  useEffect(() => {
    if (server && server !== value) {
      setValue(server);
    }
  }, [server]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleClick = () => {
    if (gameSettings) {
      setGameSettings({
        ...gameSettings,
        server: value,
      });
    }
  };

  if (gameSettings) {
    return (
      <Grid item xs>
        <FormControl fullWidth>
          <TextField
            label="服务器地址"
            value={value}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={handleClick}>确认</Button>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </Grid>
    );
  }

  return null;
};

const Component = (): ReactElement => (
  <Grid container p={2} spacing={2}>
    <Server />
  </Grid>
);

export default Component;

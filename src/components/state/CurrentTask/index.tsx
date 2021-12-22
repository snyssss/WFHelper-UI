import React, { ReactElement, useContext } from 'react';

import {
  Box,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography,
  paperClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { SocketContext } from '~/components/context/socket';
import { useGameStateByKey, useGameTargetList } from '~/data';

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

const Component = (): ReactElement => {
  const { sendMessage } = useContext(SocketContext);

  const currentTask = useGameStateByKey('currentTargets');

  const [taskList] = useGameTargetList();

  const handleChange = (event: SelectChangeEvent) => {
    sendMessage('changeTargets', event.target.value as string);
  };

  return (
    <StyledPaper>
      <StyledBox>
        <Typography variant="h6">当前任务</Typography>
        <Select
          size="small"
          value={currentTask as string}
          onChange={handleChange}
        >
          {(taskList || []).map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </StyledBox>
    </StyledPaper>
  );
};

export default Component;

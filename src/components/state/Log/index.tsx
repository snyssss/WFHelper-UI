import React, { CSSProperties, ReactElement } from 'react';
import { FixedSizeList } from 'react-window';

import { Delete } from '@mui/icons-material';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { DateTime } from 'luxon';

import { useGameLog } from '~/data';

export interface RowProps {
  index: number;
  style: CSSProperties;
}

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1.5),
  borderWidth: '0 0 1px',
  borderStyle: 'solid',
  borderColor: theme.palette.divider,
}));

const Row = ({ index, style }: RowProps) => {
  const [gameLog] = useGameLog();

  if (index < (gameLog || []).length) {
    const [time, message] = (gameLog || [])[index];

    return (
      <Tooltip
        title={DateTime.fromSeconds(time).toLocaleString(
          DateTime.DATETIME_MED_WITH_SECONDS
        )}
      >
        <StyledBox
          style={style}
          key={index}
          sx={
            index % 2 === 0
              ? { background: (theme) => theme.palette.grey[100] }
              : {}
          }
        >
          <Typography variant="body2" noWrap>
            {message}
          </Typography>
        </StyledBox>
      </Tooltip>
    );
  }

  return null;
};

const Component = (): ReactElement => {
  const [gameLog, setGameLog] = useGameLog();

  const handleClick = () => {
    setGameLog([]);
  };

  return (
    <Card>
      <CardHeader
        action={
          <Tooltip title="清空">
            <IconButton onClick={handleClick}>
              <Delete />
            </IconButton>
          </Tooltip>
        }
        title="日志"
      />
      <Divider />
      <FixedSizeList
        className="List"
        width="100%"
        height={400}
        itemCount={gameLog ? gameLog.length : 0}
        itemSize={40}
      >
        {Row}
      </FixedSizeList>
    </Card>
  );
};

export default Component;

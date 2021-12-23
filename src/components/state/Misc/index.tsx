import React, { CSSProperties, ReactElement } from 'react';
import { FixedSizeList } from 'react-window';

import {
  Box,
  Card,
  CardHeader,
  Divider,
  Link,
  Tooltip,
  TooltipProps,
  Typography,
  tooltipClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { useGameState } from '~/data';

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

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
    maxHeight: 400,
    whiteSpace: 'pre',
    overflowY: 'auto',
  },
});

const renderItem = (data: unknown) => {
  if (typeof data === 'object') {
    return (
      <StyledTooltip placement="top" title={JSON.stringify(data, null, 4)}>
        <Link component="button" variant="body2" sx={{ ml: 1 }}>
          查看
        </Link>
      </StyledTooltip>
    );
  }

  return <Box ml={1}>{String(data)}</Box>;
};

const Row = ({ index, style }: RowProps) => {
  const [gameState] = useGameState();

  if (gameState) {
    if (index < Object.keys(gameState).length) {
      const key = Object.keys(gameState)[index];

      return (
        <StyledBox
          style={style}
          key={index}
          sx={
            index % 2 === 0
              ? { background: (theme) => theme.palette.grey[100] }
              : {}
          }
        >
          <Typography
            component="div"
            variant="body2"
            noWrap
            sx={{ display: 'flex' }}
          >
            {key}: {renderItem(gameState[key])}
          </Typography>
        </StyledBox>
      );
    }
  }

  return null;
};

const Component = (): ReactElement => {
  const [gameState] = useGameState();

  return (
    <Card>
      <CardHeader title="杂项" />
      <Divider />
      <FixedSizeList
        className="List"
        width="100%"
        height={400}
        itemCount={Object.keys(gameState || {}).length}
        itemSize={40}
      >
        {Row}
      </FixedSizeList>
    </Card>
  );
};

export default Component;

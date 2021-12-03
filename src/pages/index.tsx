import React, { useState } from 'react';

import { NextPage } from 'next';

import { Dashboard as DashboardIcon, Photo } from '@mui/icons-material';
import { Box, Tabs } from '@mui/material';

import TabLabel from '~/components/common/TabLabel';
import TabPanel from '~/components/common/TabPanel';
import PageContainer from '~/components/container/PageContainer';
import { Dashboard, Screen } from '~/components/main';

const IndexView: NextPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (_: unknown, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <PageContainer>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            background: (theme) => theme.palette.background.paper,
          }}
        >
          <TabLabel icon={<DashboardIcon />} title="仪表盘" />
          <TabLabel icon={<Photo />} title="屏幕" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Dashboard />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Screen />
        </TabPanel>
      </Box>
    </PageContainer>
  );
};

export default IndexView;

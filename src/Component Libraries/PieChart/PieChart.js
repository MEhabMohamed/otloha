import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PieActiveArc({ data }) {

  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      height={110}
      width={200}
      slotProps={{
        legend: {
          padding: 0,
          labelStyle: {
            fontSize: 14,
            fontWeight: "bold"
          },
          itemMarkWidth: 10,
          itemMarkHeight: 10,
          itemGap: 5,
          markGap: 10
        },
      }}
    />
  );
}
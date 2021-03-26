import React, { FunctionComponent, useContext } from "react";
import Web3Context from "../../../../../Web3Context";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
interface RewardsChartProps {
  chartData: any
}

const RewardsChart : React.FC<RewardsChartProps>  = (props) => {
  const {
    chartData
  } = props;
  return (
    <>
      <LineChart
        width={500}
        height={300}
        data={chartData}
        margin={{
          top: 20,
          right: 100,
          left: 20,
          bottom: 28,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" tick={{ fill: 'white' }} />
        <YAxis yAxisId="left"tick={{ fill: 'white' }}  />
        <YAxis yAxisId="right" orientation="right" tick={{ fill: 'white' }} />        
        <Tooltip />
        {/* <ReferenceLine x="Page C" stroke="red" label="Max PV PAGE" />
        <ReferenceLine y={9800} label="Max" stroke="red" /> */}
        <Line type="monotone" yAxisId="left" dataKey="Mist Rewards" stroke="#0bc5ea" />
        <Line type="monotone" yAxisId="right"dataKey="Ether Rewards" stroke="#35c932" />
      </LineChart>
    </>
  );
};

export default RewardsChart;

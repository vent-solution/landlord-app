// RechartsComponent.jsx
import React from "react";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";
import { FormatMoney, FormatMoneyExt } from "../actions/formatMoney";

interface Props {
  currency: string;
  data: {
    month: string;
    rentAmount: number;
  }[];
}

const MonthlyIncomeChart: React.FC<Props> = ({ currency, data }) => {
  return (
    <ResponsiveContainer width="100%" height={200} className={"text-xs"}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="color" x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
            <stop offset={"0%"} stopColor={"#ed3a99"} stopOpacity={0.8} />
            <stop offset={"75%"} stopColor={"#ed3a99"} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="month"
          axisLine={false}
          tickLine={false}
          stroke="#ffffff"
          style={{ fontSize: "80%" }}
        />
        <YAxis
          stroke="#dddddd"
          className="font-mono font-bold"
          dataKey={"rentAmount"}
          tickLine={false}
          // tickCount={50}
          tickFormatter={(value) => FormatMoneyExt(value, 2, currency)}
          axisLine={false}
          style={{ fontSize: "80%" }}
        />
        <Tooltip content={<CustomToolTip currency={currency} />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="rentAmount"
          stroke="#ed3a99"
          fill="url(#color)"
        />
        <CartesianGrid opacity={0.3} vertical={false} strokeDasharray="0 0" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const CustomToolTip = ({ active, payload, label, currency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip px-3 py-1 bg-blue-900 text-white text-sm">
        <p className="label">{`${label}: ${FormatMoney(
          payload[0].value,
          2,
          currency
        )}`}</p>
      </div>
    );
  }
  return null;
};

export default MonthlyIncomeChart;

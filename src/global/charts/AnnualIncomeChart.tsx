// RechartsComponent.jsx
import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { FormatMoney, FormatMoneyExt } from "../actions/formatMoney";

interface Props {
  currency: string;
  data: {
    year: number;
    rentAmount: number;
  }[];
}

const AnnualIncomeChart: React.FC<Props> = ({ currency, data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <defs>
          <linearGradient id="dailyColor" x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
            <stop offset={"0%"} stopColor={"#34ff38"} stopOpacity={0.5} />
            <stop offset={"75%"} stopColor={"#34ff38"} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="year"
          axisLine={false}
          tickLine={false}
          stroke="#ffffff"
          style={{ fontSize: "70%" }}
        />
        <YAxis
          stroke="#ffffff"
          dataKey={"rentAmount"}
          tickLine={false}
          // tickCount={50}
          tickFormatter={(value) => FormatMoneyExt(value, 2, currency)}
          axisLine={false}
          style={{ fontSize: "70%" }}
        />
        <Tooltip content={<CustomToolTip currency={currency} />} />
        <Legend stroke="#34ff38" />
        <Bar
          type="monotone"
          dataKey="rentAmount"
          stroke="#34ff38"
          fill={"url(#dailyColor)"}
        />
        <CartesianGrid opacity={0.3} vertical={false} strokeDasharray="0 0" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomToolTip = ({ active, payload, label, currency }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip px-3 py-1 bg-blue-900 text-sm">
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

export default AnnualIncomeChart;

import React from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { FormatMoney, FormatMoneyExt } from "../actions/formatMoney";
import { format, parseISO } from "date-fns";

interface Props {
  currency: string;
  data: {
    day: number;
    rentAmount: number;
  }[];
  yearMonth: string;
  isMonthChanged: boolean;
}

let DailyEarningsChart: React.FC<Props> = ({
  currency,
  data,
  yearMonth,
  isMonthChanged,
}) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="dailyColors" x1={"0"} y1={"0"} x2={"0"} y2={"1"}>
            <stop offset={"0%"} stopColor={"#dd8a46"} stopOpacity={0.7} />
            <stop offset={"75%"} stopColor={"#dd8a46"} stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="0 0" vertical={false} opacity={0.3} />
        <XAxis
          className="lo lowercase"
          dataKey={"day"}
          axisLine={false}
          tickLine={false}
          stroke="#ffffff"
          style={{ fontSize: "70%" }}
          tickFormatter={(num) => {
            let suffix = "th";
            let lastTwoDigits = num % 100;

            if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
              suffix = "th";
            } else {
              let lastDigit = num % 10;
              switch (lastDigit) {
                case 1:
                  suffix = "st";
                  break;
                case 2:
                  suffix = "nd";
                  break;
                case 3:
                  suffix = "rd";
                  break;
              }
            }

            return num + suffix;
          }}
        />

        <YAxis
          dataKey={"rentAmount"}
          axisLine={false}
          tickLine={false}
          stroke="#ccccff"
          // tickCount={50}
          tickFormatter={(value) =>
            FormatMoneyExt(isMonthChanged ? value : value, 2, currency)
          }
          style={{ fontSize: "70%" }}
        />
        <Tooltip
          content={
            <CustomToolTip
              currency={currency}
              yearMonth={yearMonth}
              isMonthChanged={isMonthChanged}
            />
          }
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="rentAmount"
          stroke="#dd8a46"
          fill="url(#dailyColors)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const CustomToolTip = ({
  active,
  payload,
  label,
  currency,
  yearMonth,
  isMonthChanged,
}: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip px-3 py-1 bg-blue-900 text-sm text-center font-extralight capitalize">
        <h1 className="text-gray-400">
          {format(
            parseISO(new Date(`${yearMonth}-${label}`).toISOString()),
            "eeee d, MMMM y"
          )}
        </h1>
        <p className="label py-2">
          {FormatMoney(
            isMonthChanged ? payload[0].value : payload[0].value,
            2,
            currency
          )}
        </p>
      </div>
    );
  }
  return null;
};

DailyEarningsChart = React.memo(DailyEarningsChart);

export default DailyEarningsChart;

import dynamic from "next/dynamic";
import { chartData, chartJSData } from "@/ts/types/chartColumn";
import { MonthAverage } from "@/ts/interfaces/monthAverage";
const Chart = ({
  type,
  dataType,
  monthAverage,
  lastMonthDays,
  pullsSizeAverage,
  pullsCounter,
}: {
  type: string;
  dataType: string;
  monthAverage: MonthAverage;
  pullsSizeAverage?: chartData | chartJSData;
  pullsCounter?: chartData | chartJSData;
  lastMonthDays: string[];
}): JSX.Element => {
  switch (type) {
    case "PullsSizeChart":
      const PullsSizeChart = dynamic(
        () => import("@/components/PullsSizeChart"),
        {
          ssr: false,
        }
      );
      return (
        <PullsSizeChart
          pullsSizeAverage={pullsSizeAverage}
          pullsCounter={pullsCounter}
        />
      );
    case "PullsSizeChartJS":
      const PullsSizeChartJS = dynamic(
        () => import("@/components/PullsSizeChartJS"),
        {
          ssr: false,
        }
      );
      return (
        <PullsSizeChartJS
          pullsCounter={pullsCounter}
          pullsSizeAverage={pullsSizeAverage}
        />
      );
    case "MonthChart":
      const MonthChart = dynamic(() => import("@/components/MonthChart"), {
        ssr: false,
      });
      return (
        <MonthChart
          monthAverage={monthAverage}
          dataType={dataType}
          lastMonthDays={lastMonthDays}
        />
      );
    case "MonthChartJS":
      const MonthChartJS = dynamic(() => import("@/components/MonthChartJS"), {
        ssr: false,
      });
      return (
        <MonthChartJS
          monthAverage={monthAverage}
          dataType={dataType}
          lastMonthDays={lastMonthDays}
        />
      );
    default:
      return <div></div>;
  }
};

export default Chart;

import dynamic from "next/dynamic";
import { chartColumn } from "@/ts/types/chartColumn";
import { MonthAverage } from "@/ts/interfaces/monthAverage";
const Chart = ({
  type,
  monthAverage,
  lastMonthDays,
  pullsSizeAverage,
  pullsCounter,
}: {
  type: string;
  monthAverage?: MonthAverage;
  pullsSizeAverage: chartColumn;
  pullsCounter: chartColumn;
  lastMonthDays: string[];
}): JSX.Element => {
  switch (type) {
    case "PullsSizeChart":
      const Chart = dynamic(() => import("@/components/PullsSizeChart"), {
        ssr: false,
      });
      return (
        <Chart
          pullsSizeAverage={pullsSizeAverage}
          pullsCounter={pullsCounter}
        />
      );
    case "MonthChart":
      const MonthChart = dynamic(() => import("@/components/MonthChart"), {
        ssr: false,
      });
      return (
        <MonthChart monthAverage={monthAverage} lastMonthDays={lastMonthDays} />
      );
    default:
      return <div></div>;
  }
};

export default Chart;

import dynamic from "next/dynamic";
import { chartData, chartJSData } from "@/ts/types/chartColumn";
import { issues, pulls } from "@/ts/interfaces/monthAverage";
import { memo } from "react";
import ClayProgressBar from "@clayui/progress-bar";
const Chart = ({
  type,
  dataType,
  monthAverageIssues,
  monthAveragePulls,
  lastMonthDaysH,
  lastMonthDaysM,
  pullsSizeAverage,
  pullsSizeAverageJS,
  pullsCounter,
  pullsCounterJS,
  loadingPullSizesChart,
  loadingPullMonth,
}: {
  type: string;
  dataType?: string;
  monthAverageIssues?: issues;
  monthAveragePulls?: pulls;
  pullsSizeAverageJS?: chartJSData;
  pullsSizeAverage?: chartData;
  pullsCounter?: chartData;
  pullsCounterJS?: chartJSData;
  lastMonthDaysH?: string[];
  lastMonthDaysM?: string[];
  loadingPullSizesChart: number;
  loadingPullMonth: number;
}): JSX.Element => {
  switch (type) {
    case "PullsSizeChart":
      const PullsSizeChart = dynamic(
        () => import("@/components/PullsSizeChart"),
        {
          ssr: false,
        }
      );
      if (pullsCounter && pullsSizeAverage && loadingPullSizesChart === 100) {
        return (
          <PullsSizeChart
            pullsSizeAverage={pullsSizeAverage}
            pullsCounter={pullsCounter}
          />
        );
      } else {
        return <ClayProgressBar value={loadingPullSizesChart} />;
      }
    case "PullsSizeChartJS":
      const PullsSizeChartJS = dynamic(
        () => import("@/components/PullsSizeChartJS"),
        {
          ssr: false,
        }
      );
      if (
        pullsCounterJS &&
        pullsSizeAverageJS &&
        loadingPullSizesChart === 100
      ) {
        return (
          <PullsSizeChartJS
            pullsCounterJS={pullsCounterJS}
            pullsSizeAverageJS={pullsSizeAverageJS}
          />
        );
      } else {
        return <ClayProgressBar value={loadingPullSizesChart} />;
      }

    case "MonthChart":
      const MonthChart = dynamic(() => import("@/components/MonthChart"), {
        ssr: false,
      });
      if (
        monthAverageIssues ||
        (monthAveragePulls && dataType && lastMonthDaysH)
      ) {
        return (
          <MonthChart
            monthAverageIssues={monthAverageIssues}
            monthAveragePulls={monthAveragePulls}
            dataType={dataType}
            lastMonthDaysH={lastMonthDaysH}
          />
        );
      } else {
        return <div></div>;
      }
    case "MonthChartJS":
      const MonthChartJS = dynamic(() => import("@/components/MonthChartJS"), {
        ssr: false,
      });
      if (
        monthAverageIssues ||
        (monthAveragePulls &&
          dataType &&
          lastMonthDaysM &&
          loadingPullMonth === 100)
      ) {
        return (
          <MonthChartJS
            monthAverageIssues={monthAverageIssues}
            monthAveragePulls={monthAveragePulls}
            dataType={dataType}
            lastMonthDaysM={lastMonthDaysM}
          />
        );
      } else {
        return <ClayProgressBar value={loadingPullMonth} />;
      }

    default:
      return <div></div>;
  }
};

export const ChartComponent = memo(Chart);

export default ChartComponent;

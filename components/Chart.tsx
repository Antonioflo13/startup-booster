//NEXT
import dynamic from "next/dynamic";
//REACT
import { memo } from "react";
//TS
import { ChartProps } from "@/ts/interfaces/ChartProps";
//COMPONENTS
import ClayProgressBar from "@clayui/progress-bar";
const Chart = ({
  type,
  dataType,
  monthIssuesAverage,
  monthPullsAverage,
  lastMonthDaysH,
  lastMonthDaysM,
  pullsSizeAverage,
  pullsSizeAverageJS,
  pullsCounter,
  pullsCounterJS,
  loadingPullSizesChart,
  loadingPullMonth,
  loadingIssuesMonth,
}: ChartProps): JSX.Element => {
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
        return (
          <ClayProgressBar
            value={loadingPullSizesChart ? loadingPullSizesChart : 0}
          />
        );
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
        loadingPullSizesChart &&
        loadingPullSizesChart >= 100
      ) {
        return (
          <PullsSizeChartJS
            pullsCounterJS={pullsCounterJS}
            pullsSizeAverageJS={pullsSizeAverageJS}
          />
        );
      } else {
        return (
          <ClayProgressBar
            value={loadingPullSizesChart ? loadingPullSizesChart : 0}
          />
        );
      }

    case "MonthChart":
      const MonthChart = dynamic(() => import("@/components/MonthChart"), {
        ssr: false,
      });
      if (monthIssuesAverage && dataType && lastMonthDaysH) {
        return (
          <MonthChart
            monthIssuesAverage={monthIssuesAverage}
            lastMonthDaysH={lastMonthDaysH}
          />
        );
      } else {
        return <div></div>;
      }
    case "MonthPullsChartJS":
      const MonthPullsChartJS = dynamic(
        () => import("@/components/MonthPullsChartJS"),
        {
          ssr: false,
        }
      );
      if (
        monthPullsAverage &&
        dataType &&
        lastMonthDaysM &&
        loadingPullMonth &&
        loadingPullMonth >= 100 &&
        loadingIssuesMonth &&
        loadingIssuesMonth >= 100
      ) {
        return (
          <MonthPullsChartJS
            monthPullsAverage={monthPullsAverage}
            dataType={dataType}
            lastMonthDaysM={lastMonthDaysM}
          />
        );
      } else {
        return (
          <ClayProgressBar value={loadingPullMonth ? loadingPullMonth : 0} />
        );
      }
    case "MonthIssuesChartJS":
      const MonthIssuesChartJS = dynamic(
        () => import("@/components/MonthIssuesChartJS"),
        {
          ssr: false,
        }
      );
      if (
        monthIssuesAverage &&
        dataType &&
        lastMonthDaysM &&
        loadingIssuesMonth &&
        loadingIssuesMonth >= 100 &&
        loadingPullMonth &&
        loadingPullMonth >= 100
      ) {
        return (
          <MonthIssuesChartJS
            monthIssuesAverage={monthIssuesAverage}
            dataType={dataType}
            lastMonthDaysM={lastMonthDaysM}
          />
        );
      } else {
        return (
          <ClayProgressBar
            value={loadingIssuesMonth ? loadingIssuesMonth : 0}
          />
        );
      }

    default:
      return <div></div>;
  }
};

export const ChartComponent = memo(Chart);

export default ChartComponent;

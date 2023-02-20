import { issues, pulls } from "@/ts/interfaces/monthAverage";
import { chartData, chartJSData } from "@/ts/types/chartColumn";

export interface ChartProps {
  type: string;
  dataType?: string;
  monthIssuesAverage?: issues;
  monthPullsAverage?: pulls;
  pullsSizeAverageJS?: chartJSData;
  pullsSizeAverage?: chartData;
  pullsCounter?: chartData;
  pullsCounterJS?: chartJSData;
  lastMonthDaysH?: string[];
  lastMonthDaysM?: string[];
  loadingPullSizesChart?: number;
  loadingPullMonth?: number;
  loadingIssuesMonth?: number;
}

//CHART
import ClayChart from "@clayui/charts";
//TS
import { issues } from "@/ts/interfaces/monthAverage";
function MonthChart({
  monthIssuesAverage,
  lastMonthDaysH,
}: {
  monthIssuesAverage: issues;
  lastMonthDaysH?: string[];
}): JSX.Element {
  return (
    <>
      <ClayChart
        data={{
          x: "x",
          json: {
            opened: monthIssuesAverage ? monthIssuesAverage.opened : [],
            closed: monthIssuesAverage ? monthIssuesAverage.closed : [],
            x: lastMonthDaysH,
          },
          type: "line",
          xFormat: "%m-%d-%Y %H:%M",
        }}
        axis={{
          x: {
            tick: {
              fit: false,
            },
            type: "timeseries",
          },
        }}
        tooltip={{
          init: {
            show: true,
          },
          doNotHide: true,
          contents: {
            template: `
              <div class="fade tooltip clay-tooltip-top show" role="tooltip">
                <div class="arrow"></div>
                <div style="color: black; min-width: 160px" class="tooltip-inner bg-white">
                  <ul>
                    {{<li class="d-flex justify-content-between"><span>{=NAME}</span><span>{=VALUE}</span></li>}}
                  </ul>
                </div>
              </div>`,
          },
        }}
      />
    </>
  );
}

export default MonthChart;

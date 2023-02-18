import ClayChart from "@clayui/charts";
import { issues, pulls } from "@/ts/interfaces/monthAverage";
function MothChart({
  monthAverageIssues,
  monthAveragePulls,
  dataType,
  lastMonthDaysH,
}: {
  monthAverageIssues: issues;
  monthAveragePulls: pulls;
  dataType: string;
  lastMonthDaysH: string[];
}): JSX.Element {
  return (
    <>
      <ClayChart
        data={{
          x: "x",
          json: {
            opened: monthAverageIssues ? monthAverageIssues.opened : [],
            closed: monthAverageIssues ? monthAverageIssues.closed : [],
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

export default MothChart;

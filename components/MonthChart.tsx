import ClayChart from "@clayui/charts";
function MothChart({
  monthAverage,
  lastMonthDays,
}: {
  monthAverage: { opened: number[]; closed: number[] };
  lastMonthDays: string[];
}): JSX.Element {
  return (
    <>
      <ClayChart
        data={{
          x: "x",
          json: {
            opened: monthAverage ? monthAverage.opened : [],
            closed: monthAverage ? monthAverage.closed : [],
            x: lastMonthDays,
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

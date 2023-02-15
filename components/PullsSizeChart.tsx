import ClayChart from "@clayui/charts";
import { chartColumn } from "@/ts/types/chartColumn";

function ChartDynamic({
  pullsSizeAverage,
  pullsCounter,
}: {
  pullsSizeAverage?: chartColumn;
  pullsCounter?: chartColumn;
}) {
  const COLUMNS = [pullsSizeAverage, pullsCounter];
  return (
    <>
      <ClayChart
        data={{
          columns: COLUMNS,
          type: "bar",
          groups: [["Average Time", "Average"]],
          colors: {
            ["Average Time"]: "#4B9BFF",
            Average: "#4B9BFF",
          },
        }}
        legend={{
          show: false,
        }}
        axis={{
          x: {
            type: "category",
            categories: ["small", "medium", "large"],
          },
          y: {
            tick: {
              type: "timeseries",
              format: function (x: any) {
                return `${x}h`;
              },
            },
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

export default ChartDynamic;

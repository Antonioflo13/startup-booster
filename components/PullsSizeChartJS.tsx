//REACT
import { useEffect } from "react";
//CHART
import Chart from "chart.js/auto";
//TS
import { chartJSData } from "@/ts/types/chartColumn";

const PullsSizeChartJS = ({
  pullsSizeAverageJS,
  pullsCounterJS,
}: {
  pullsSizeAverageJS: chartJSData;
  pullsCounterJS: chartJSData;
}): JSX.Element => {
  useEffect(() => {
    if (document.getElementById("pullsSizeChartJS")) {
      const ctx = document.getElementById("pullsSizeChartJS");
      (async function () {
        // @ts-ignore
        new Chart(ctx, {
          type: "bar",
          options: {
            scales: {
              y: {
                ticks: {
                  callback: function (value) {
                    return value + "h";
                  },
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: "#fcfcfc",
                bodyColor: "black",
                displayColors: false,
                padding: 15,
                yAlign: "bottom",
                callbacks: {
                  title(): string {
                    return "";
                  },
                  beforeLabel(tooltipItems: any): string {
                    return `Average Time: ${
                      tooltipItems.dataset.data[tooltipItems.dataIndex]
                    }h`;
                  },
                  label(tooltipItems: any): string {
                    return `Pull Requests: ${
                      pullsCounterJS.find(
                        (counter) => counter.type === tooltipItems.label
                      )!.count
                    }`;
                  },
                },
              },
            },
          },
          data: {
            labels: pullsCounterJS.map((row) => row.type),
            datasets: [
              {
                label: "Average Time",
                data: pullsSizeAverageJS.map((row) => row.count),
                stack: "Average Time",
                backgroundColor: "#4B9BFF",
              },
              {
                label: "Pull Requests",
                data: pullsCounterJS.map((row) => row.count),
                stack: "Pull Requests",
                hidden: true,
              },
            ],
          },
        });
        return () => {
          const el = document.getElementById("pullsSizeChartJS");
          el?.remove();
        };
      })();
    }
  }, [pullsCounterJS, pullsSizeAverageJS]);
  return <canvas id="pullsSizeChartJS"></canvas>;
};

export default PullsSizeChartJS;

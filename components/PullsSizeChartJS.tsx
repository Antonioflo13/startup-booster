//REACT
import { useEffect } from "react";
//CHART
import Chart from "chart.js/auto";
//TS
import { chartJSData } from "@/ts/types/chartColumn";

const PullsSizeChartJS = ({
  pullsCounter,
  pullsSizeAverage,
}: {
  pullsSizeAverage: chartJSData;
  pullsCounter: chartJSData;
}): JSX.Element => {
  useEffect(() => {
    if (document.getElementById("pullsSizeChartJS")) {
      const ctx = document.getElementById("pullsSizeChartJS");
      (async function () {
        // @ts-ignore
        new Chart(ctx, {
          type: "bar",
          options: {
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: "#fcfcfc",
                bodyColor: "black",
                displayColors: false,
                padding: 15,
              },
            },
          },
          data: {
            labels: pullsCounter.map((row) => row.type),
            datasets: [
              {
                label: "Average Time",
                data: pullsSizeAverage.map((row) => row.count),
                stack: "Average Time",
              },
              {
                label: "Pull Requests",
                data: pullsCounter.map((row) => row.count),
                stack: "Pull Requests",
                hidden: true,
              },
            ],
          },
        });
      })();
    }
    return () => {
      const element = document.getElementById("pullsSizeChartJS");
      element?.remove();
    };
  }, []);
  return <canvas id="pullsSizeChartJS"></canvas>;
};

export default PullsSizeChartJS;

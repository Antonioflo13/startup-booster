import Chart from "chart.js/auto";
import { useEffect } from "react";
import { issues, pulls } from "@/ts/interfaces/monthAverage";

const PullsSizeChartJS = ({
  lastMonthDaysM,
  monthAverage,
  dataType,
}: {
  lastMonthDaysM: string[];
  monthAverage: issues | pulls;
  dataType: string;
}) => {
  let datasets: { label: string; data: number[] }[];
  switch (dataType) {
    case "issues":
      datasets = [
        {
          label: "Opened",
          data: monthAverage.opened,
        },
        {
          label: "Closed",
          data: monthAverage.closed,
        },
      ];
      break;
    case "pulls":
      if ("merged" in monthAverage) {
        datasets = [
          {
            label: "Opened",
            data: monthAverage.opened,
          },
          {
            label: "Closed",
            data: monthAverage.closed,
          },
          {
            label: "Merged",
            data: monthAverage.merged,
          },
        ];
      }
  }
  useEffect(() => {
    (async function () {
      // @ts-ignore
      new Chart(document.getElementById(dataType), {
        type: "line",
        options: {
          plugins: {
            legend: {
              position: "bottom",
            },
            tooltip: {
              backgroundColor: "#fcfcfc",
              titleColor: "black",
              bodyColor: "black",
              displayColors: true,
              usePointStyle: true,
              padding: 15,
            },
          },
        },
        data: {
          labels: lastMonthDaysM,
          datasets: datasets,
        },
      });
    })();
    return () => {
      const element = document.getElementById(dataType);
      element?.remove();
    };
  }, []);
  return <canvas id={dataType}></canvas>;
};

export default PullsSizeChartJS;

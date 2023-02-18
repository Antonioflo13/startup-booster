import Chart from "chart.js/auto";
import { useEffect } from "react";
import { issues, pulls } from "@/ts/interfaces/monthAverage";

const PullsSizeChartJS = ({
  lastMonthDaysM,
  monthAverageIssues,
  monthAveragePulls,
  dataType,
}: {
  lastMonthDaysM: string[];
  monthAverageIssues: issues;
  monthAveragePulls: pulls;
  dataType: string;
}) => {
  let datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
  switch (dataType) {
    case "issues":
      datasets = [
        {
          label: "Opened",
          data: monthAverageIssues.opened,
          borderColor: "#FF3A00",
          backgroundColor: "#FF3A00",
        },
        {
          label: "Closed",
          data: monthAverageIssues.closed,
          borderColor: "#0FC600",
          backgroundColor: "#0FC600",
        },
      ];
      break;
    case "pulls":
      datasets = [
        {
          label: "Merged",
          data: monthAveragePulls.merged,
          borderColor: "#B20AFF",
          backgroundColor: "#B20AFF",
        },
        {
          label: "Opened",
          data: monthAveragePulls.opened,
          borderColor: "#FF3A00",
          backgroundColor: "#FF3A00",
        },
        {
          label: "Closed",
          data: monthAveragePulls.closed,
          borderColor: "#0FC600",
          backgroundColor: "#0FC600",
        },
      ];
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
              labels: {
                usePointStyle: true,
                pointStyle: "circle",
                boxHeight: 5,
              },
            },
            tooltip: {
              backgroundColor: "#fcfcfc",
              titleColor: "black",
              bodyColor: "black",
              displayColors: true,
              usePointStyle: true,
              padding: 15,
              yAlign: "bottom",
              callbacks: {
                title(): string {
                  return "Pull Requests";
                },
              },
            },
          },
          elements: {
            point: {
              pointStyle: false,
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

//REACT
import { useEffect } from "react";
//CHART
import Chart from "chart.js/auto";
//TS
import { pulls } from "@/ts/interfaces/monthAverage";

const MonthPullsChartJS = ({
  lastMonthDaysM,
  monthPullsAverage,
  dataType,
}: {
  lastMonthDaysM: string[];
  monthPullsAverage: pulls;
  dataType: string;
}) => {
  let datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
  datasets = [
    {
      label: "Merged",
      data: monthPullsAverage.merged,
      borderColor: "#B20AFF",
      backgroundColor: "#B20AFF",
    },
    {
      label: "Opened",
      data: monthPullsAverage.opened,
      borderColor: "#FF3A00",
      backgroundColor: "#FF3A00",
    },
    {
      label: "Closed",
      data: monthPullsAverage.closed,
      borderColor: "#0FC600",
      backgroundColor: "#0FC600",
    },
  ];

  //EFFECT
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
  }, [monthPullsAverage]);
  return <canvas id={dataType}></canvas>;
};

export default MonthPullsChartJS;

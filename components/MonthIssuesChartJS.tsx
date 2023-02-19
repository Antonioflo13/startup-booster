//REACT
import { useEffect } from "react";
//CHART
import Chart from "chart.js/auto";
//TS
import { issues } from "@/ts/interfaces/monthAverage";

const MonthIssuesChartJS = ({
  lastMonthDaysM,
  monthIssuesAverage,
  dataType,
}: {
  lastMonthDaysM: string[];
  monthIssuesAverage: issues;
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
      label: "Opened",
      data: monthIssuesAverage.opened,
      borderColor: "#FF3A00",
      backgroundColor: "#FF3A00",
    },
    {
      label: "Closed",
      data: monthIssuesAverage.closed,
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
  }, [monthIssuesAverage]);
  return <canvas id={dataType}></canvas>;
};

export default MonthIssuesChartJS;

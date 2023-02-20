//TS
import { IssuesResponse } from "@/ts/interfaces/issuesResponse";
import { PullsResponse } from "@/ts/interfaces/pullsReponse";

let timeDiff: number = 0;

// SET LAST MONTH
export const getLastMonth = (): string => {
  const today = new Date();
  today.setDate(today.getDate() - 30);
  return today.toISOString().split(".")[0] + "Z";
};

// SET HUMAN ELAPSED TIME
export const convertTime = (time: number): string => {
  let d, h, m, s;
  s = Math.floor(time / 1000);
  m = Math.floor(s / 60);
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  return d + "day " + h + "h" + m + "m";
};
//COVERT TIME IN MS IN HOUR
export const convertMsToHour = (time: number) => {
  let h, m, s;
  s = Math.floor(time / 1000);
  m = Math.floor(s / 60);
  h = Math.floor(m / 60);
  h = h % 24;
  return h;
};

export const calculateAverageTime = (
  responseData: IssuesResponse[] | PullsResponse[]
): string => {
  for (const data of responseData) {
    const created = new Date(data.created_at);
    const closed = new Date(data.closed_at);
    timeDiff += closed.getTime() - created.getTime();
  }
  const average = convertTime(timeDiff / responseData.length);
  timeDiff = 0;
  return average;
};

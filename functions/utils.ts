import { getPull } from "@/api/pulls";
import { gitHubRequest } from "@/functions/gitHubRequest";
import { IssuesResponse } from "@/ts/interfaces/issuesResponse";
import { PullsResponse } from "@/ts/interfaces/pullsReponse";

let monthlyIssues: { [key: number]: unknown }[] = [];
let timeDiff: number = 0;
let totalSize: number = 0;

// SET LAST MONTH
export const getLastMonth = (): string => {
  const today = new Date();
  today.setMonth(today.getMonth() - 1);
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
  return d + " day " + h + "h" + m + "m";
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

export const checkData = (
  responseData: {
    [key: number]: any;
    created_at: string;
    closed_at: string;
  }[]
) => {
  if (responseData.length) {
    monthlyIssues = [...monthlyIssues, ...responseData];
    return false;
  }
  if (!responseData.length) {
    const response = monthlyIssues;
    monthlyIssues = [];
    return response;
  }
};

export const calculateAverageTime = (
  responseData: IssuesResponse[] | PullsResponse[]
): string => {
  for (const data of responseData) {
    const created = new Date(data.created_at);
    const closed = new Date(data.closed_at);
    timeDiff += closed.getTime() - created.getTime();
  }
  const average = convertTime(timeDiff);
  timeDiff = 0;
  return average;
};

export const calculateAverageSize = async (
  responseData: {
    [key: number]: any;
    number: number;
  }[]
): Promise<number> => {
  for (const data of responseData) {
    console.log(data.number);
    const { deletions, additions } = await getPull(data.number);
    totalSize += deletions + additions;
  }
  return totalSize;
};

export const issues = async (pageNumber: number, lastMonth?: string) => {
  const { status, data } = await gitHubRequest(
    "GET /repos/{owner}/{repo}/issues",
    "all",
    pageNumber,
    lastMonth
  );
  const checkResponse = checkData(data);
  if (!checkResponse) {
    pageNumber++;
    issues(pageNumber++);
  }
  if (checkResponse) {
    return checkResponse;
  }
};

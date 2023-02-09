import { Octokit } from "octokit";
import type { NextApiRequest, NextApiResponse } from "next";

export default function getRepoInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //GITHUB INITIALIZATION
  const octokit = new Octokit({
    auth: process.env.GIT_API_KEY,
  });
  // GLOBAL VARIABLE
  let monthlyIssues : {[key: number]: unknown}[] = [];
  let timeDiff : number = 0;
  // SET LAST MONTH
  const today = new Date();
  today.setMonth(today.getMonth() - 1);
  const lastMonth = today.toISOString().split(".")[0] + "Z";
  //FUNCTIONS
  // SET HUMAN ELAPSED TIME
  function convertTime(time: number) {
    let d, h, m, s;
    s = Math.floor(time / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return d + " days, " + h + " hours, " + m + " minutes, " + s + " seconds.";
  }
  //GITHUB API
  const issues = async (pageNumber : number, lastMonth: string | undefined = undefined) => {
    let page = pageNumber;
    await octokit
      .request("GET /repos/{owner}/{repo}/issues", {
        owner: process.env.GIT_HUB_OWNER || '',
        repo: process.env.GIT_HUB_REPO || '',
        state: "closed",
        since: lastMonth,
        page: page,
        ["per_page"]: 100,
      })
      .then((response: {status: number, data: {[key: string]: any}[]}) => {
        if (response.data.length) {
          for (const responseElement of response.data) {
            const created = new Date(responseElement.created_at);
            const closed = new Date(responseElement.closed_at);
            timeDiff += closed.getTime() - created.getTime();
          }
          monthlyIssues = [...monthlyIssues, ...response.data];
          page++
          issues(page);
        }
        if (!response.data.length) {
          const averageIssue = convertTime(timeDiff);
          res.status(response.status).json(averageIssue);
        }
      })
      .catch((error: { code: number, message: string }) => {
        res.status(error.code).json(error.message);
        console.error("Error sending message:", error);
      });
  };
  const pullRequests = async () => {
    await octokit
      .request("GET /repos/{owner}/{repo}/pulls", {
        owner: process.env.GIT_HUB_OWNER || '',
        repo: process.env.GIT_HUB_REPO || '',
        state: "closed",
        since: lastMonth,
        ["per_page"]: 100,
      })
      .then((response: {status: number, data: any}) => {
        res.status(response.status).json(response.data);
      })
      .catch((error: { code: number, message: string }) => {
        res.status(error.code).json({ response: error.message });
        console.error("Error sending message:", error);
      });
  };

  issues(1);
  // pullRequests();
}

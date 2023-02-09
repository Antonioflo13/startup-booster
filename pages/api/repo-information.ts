import { Octokit } from "octokit";
import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const octokit = new Octokit({
    auth: "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",
  });
  const lastMonth = new Date();
  today.setMonth(today.getMonth() - 1);
  today.toISOString().split(".")[0] + "Z";
  const issues = async () => {
    await octokit
      .request("GET /repos/{owner}/{repo}/issues", {
        owner: process.env.GIT_HUB_OWNER,
        repo: process.env.GIT_HUB_REPO,
        state: "closed",
        since: lastMonth,
        ["per_page"]: 100,
      })
      .then((response: {}) => {
        res.status(response.status).json(response);
      })
      .catch((error: { code: number }) => {
        res.status(error.code).json({ response: error.message });
        console.error("Error sending message:", error);
      });
  };
  issues();
  // const issues = async () => {
  //   await octokit
  //     .request("GET /repos/{owner}/{repo}/issues", {
  //       owner: process.env.GIT_HUB_OWNER,
  //       repo: process.env.GIT_HUB_REPO,
  //       state: "closed",
  //       since: today.toISOString().split(".")[0] + "Z",
  //       ["per_page"]: 100,
  //     })
  //     .then((response: {}) => {
  //       res.status(response.status).json(response);
  //     })
  //     .catch((error: { code: number }) => {
  //       res.status(error.code).json({ response: error.message });
  //       console.error("Error sending message:", error);
  //     });
  // };
}
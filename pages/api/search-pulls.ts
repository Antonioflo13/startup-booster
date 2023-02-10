import type { NextApiRequest, NextApiResponse } from "next";
import { gitHubRequest } from "@/functions/gitHubRequest";
import { checkData, getLastMonth } from "@/functions/utils";

export default function getRepoInfo(req: NextApiRequest, res: NextApiResponse) {
  const pulls = async (
    pageNumber: number,
    lastMonth: string | undefined = undefined
  ) => {
    const { status, data } = await gitHubRequest(
      "GET /repos/{owner}/{repo}/pulls",
      "closed",
      pageNumber,
      lastMonth
    );
    const checkResponse = checkData(data);
    if (!checkResponse) {
      pageNumber++;
      pulls(pageNumber++);
    }
    if (checkResponse) {
      res.status(status).json(checkResponse);
    }
  };

  pulls(1);
}

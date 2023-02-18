import { Octokit } from "octokit";

//GITHUB INITIALIZATION
const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GIT_API_KEY,
});
export const gitHubRequest = async (
  url: string,
  state?: string | string[] | undefined,
  page?: number,
  lastMonth?: string | undefined
) => {
  return await octokit.request(url, {
    owner: process.env.NEXT_PUBLIC_GIT_HUB_OWNER || "",
    repo: process.env.NEXT_PUBLIC_GIT_HUB_REPO || "",
    state: state,
    since: lastMonth,
    page: page,
    ["per_page"]: 100,
  });
};

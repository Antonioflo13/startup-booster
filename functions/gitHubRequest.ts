import { Octokit } from "octokit";

//GITHUB INITIALIZATION
const octokit = new Octokit({
  auth: process.env.GIT_API_KEY,
});
export const gitHubRequest = async (
  url: string,
  state: string,
  page: number,
  lastMonth: string | undefined = undefined
) => {
  return await octokit.request(url, {
    owner: process.env.GIT_HUB_OWNER || "",
    repo: process.env.GIT_HUB_REPO || "",
    state: state,
    since: lastMonth,
    page: page,
    ["per_page"]: 100,
  });
};

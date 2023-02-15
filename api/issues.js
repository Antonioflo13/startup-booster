import request from "./request";

async function searchIssues(params) {
  return await request(
    "http://localhost:3000/api/issues?" +
      new URLSearchParams({
        ...params,
      })
  );
}

export { searchIssues };

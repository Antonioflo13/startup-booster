import request from "./request";

async function searchPulls(params) {
  return await request("http://localhost:3000/api/pulls", params);
}

async function getPull(number, params) {
  return await request(`http://localhost:3000/api/pulls/${number}`, params);
}

export { searchPulls, getPull };

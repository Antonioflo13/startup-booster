async function request(URL, body) {
  const options = {
    endpoint: URL,
    method: "GET",
    body: body && JSON.stringify({ ...body }),
  };

  try {
    return await fetch(URL, options).then((response) => {
      return response.json();
    });
  } catch (error) {
    throw new Error("Products not fetched");
  }
}

export default request;

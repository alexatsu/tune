const handleFetch = async <T>(url: string, method = "GET", body = {}, headers = {}): Promise<T> => {
  const reqHeaders = { ...headers, "Content-Type": "application/json" };
  const reqBody = method === "GET" || method === "DELETE" ? undefined : JSON.stringify(body);

  const response = await fetch(url, {
    method,
    headers: reqHeaders,
    body: reqBody,
    credentials: "include",
  });

  if (!response.ok) {
    const error = new Error(
      `An error occurred while fetching the data. Status: ${response.status} `
    );

    error.message = await response.json();

    throw error;
  }

  const data = await response.json();
  return data as T;
};

export { handleFetch };

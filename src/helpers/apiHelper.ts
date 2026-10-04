const BASE_URL = "https://open-api.delcom.org/api/v1";

export const apiHelper = {
  get: async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    const data = await response.json();
    if (!response.ok) throw { response: { data } };
    return { data };
  },

  post: async (endpoint: string, body: any, options: RequestInit = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(body),
      ...options,
    });
    const data = await response.json();
    if (!response.ok) throw { response: { data } };
    return { data };
  },
};
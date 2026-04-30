const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

async function apiFetch(path: string, token?: string | null, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  subscriptions: {
    list: (token?: string | null) => apiFetch("/api/subscriptions", token),
    pay: (id: string, token?: string | null) =>
      apiFetch(`/api/subscriptions/${id}/pay`, token, { method: "POST" }),
    delete: (id: string, token?: string | null) =>
      apiFetch(`/api/subscriptions/${id}`, token, { method: "DELETE" }),
  },
  push: {
    register: (pushToken: string, authToken?: string | null) =>
      apiFetch("/api/push/register", authToken, {
        method: "POST",
        body: JSON.stringify({ token: pushToken, platform: "expo" }),
      }),
  },
};

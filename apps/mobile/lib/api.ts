const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  subscriptions: {
    list: () => apiFetch("/api/subscriptions"),
    pay: (id: string) => apiFetch(`/api/subscriptions/${id}/pay`, { method: "POST" }),
    delete: (id: string) => apiFetch(`/api/subscriptions/${id}`, { method: "DELETE" }),
  },
  push: {
    register: (token: string) =>
      apiFetch("/api/push/register", {
        method: "POST",
        body: JSON.stringify({ token, platform: "expo" }),
      }),
  },
};

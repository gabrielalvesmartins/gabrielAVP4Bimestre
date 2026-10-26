const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
export async function api(path, options = {}) {
  const token = localStorage.getItem("reserva_token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (response.status === 204) return null;
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) localStorage.removeItem("reserva_token");
    throw new Error(data.message || "Não foi possível comunicar com o servidor.");
  }
  return data;
}

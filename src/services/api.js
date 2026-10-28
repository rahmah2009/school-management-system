const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

export function getAuthToken() {
    return sessionStorage.getItem("greenfield_admin_token");
}

export async function apiRequest(path, options = {}) {
    const token = getAuthToken();
    const headers = {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    let response;
    try {
        response = await fetch(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`, {
            ...options,
            headers,
        });
    } catch {
        throw new Error(
            "Unable to connect to the server. Check the deployed API URL and try again."
        );
    }

    const raw = await response.text();
    let data = {};
    if (raw) {
        try {
            data = JSON.parse(raw);
        } catch {
            throw new Error("The server returned an unexpected response. Check the API URL.");
        }
    }

    if (!response.ok || data.success === false) {
        if (response.status === 401) {
            sessionStorage.removeItem("greenfield_admin_token");
            sessionStorage.removeItem("greenfield_admin");
        }
        throw new Error(data.message || `Request failed (${response.status}).`);
    }

    return data;
}

export function clearAdminSession() {
    sessionStorage.removeItem("greenfield_admin_token");
    sessionStorage.removeItem("greenfield_admin");
}

export { API_BASE_URL };

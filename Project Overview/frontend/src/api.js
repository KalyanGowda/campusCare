export const API = 'http://localhost:3000';
// Wrapper so every fetch automatically includes credentials (session cookie)
export async function apiFetch(path, options = {}) {
    const res = await fetch(`${API}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
            ...options.headers,
        },
    });
    return res;
}

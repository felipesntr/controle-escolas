export const API_URL = "http://localhost:3000";

export function buildApiUrl(path: string) {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_URL}${normalizedPath}`;
}

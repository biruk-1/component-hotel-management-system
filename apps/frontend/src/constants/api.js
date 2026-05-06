import { API_URL } from "@hotel/shared";

/** Base URL for `/api/rooms` collection endpoints. */
export const ROOMS_COLLECTION_URL = `${API_URL}/api/rooms`;

/** Backend readiness probe (`/health`). */
export const HEALTH_CHECK_URL = `${API_URL}/health`;

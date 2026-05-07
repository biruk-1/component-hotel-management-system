import {
  API_URL,
  HEALTH_API_PATH,
  roomsApiUrl
} from "@hotel/shared";

/** Base URL for `/api/rooms` collection endpoints. */
export const ROOMS_COLLECTION_URL = roomsApiUrl;

/** Backend readiness probe (`/health`). */
export const HEALTH_CHECK_URL = `${API_URL}${HEALTH_API_PATH}`;

// src/utils/apiError.js
// Normalizes Axios errors into a consistent shape for all pages.
// Returns: { status, message, data }

/**
 * Normalize any Axios (or unknown) error into a predictable object.
 *
 * Priority for message:
 *   1. error.response.data.message  (backend JSON error, e.g. "Unauthorized")
 *   2. error.message                (Axios/network message, e.g. "Network Error")
 *   3. 'An unexpected error occurred' (final fallback)
 *
 * status is the HTTP status code when the server responded, otherwise null.
 * data   is the raw backend response body without transformation, or null.
 *
 * @param {unknown} error - The error thrown by an Axios call.
 * @returns {{ status: number | null, message: string, data: unknown }}
 */
export function normalizeApiError(error) {
  // Server responded with an HTTP error status (4xx, 5xx)
  if (error && error.response) {
    const { status, data } = error.response;
    const message =
      (data && typeof data.message === 'string' && data.message) ||
      error.message ||
      'An unexpected error occurred';
    return { status, message, data: data ?? null };
  }

  // Request was made but no response received (e.g. network offline, timeout)
  if (error && error.request) {
    return {
      status: null,
      message: 'Network error — please check your connection and try again.',
      data: null,
    };
  }

  // Anything else (programming error, cancelled request, etc.)
  return {
    status: null,
    message: (error && error.message) || 'An unexpected error occurred',
    data: null,
  };
}

/**
 * Extracts a single-line user-friendly error message from an RTK Query error object.
 * Prevents HTML blobs or technical syntax errors from being displayed to the user.
 */
export const getErrorMessage = (err) => {
  if (!err) return "";

  // 1. Check for backend-provided message (JSON)
  const backendMessage = err?.data?.message || err?.data?.error;
  
  if (backendMessage) {
    if (Array.isArray(backendMessage)) {
      return backendMessage.join(", ");
    }
    if (typeof backendMessage === "string") {
      // If it looks like HTML, don't return it
      if (backendMessage.trim().startsWith("<!DOCTYPE") || backendMessage.trim().startsWith("<html")) {
        return "Internal Server Error (Unexpected HTML response)";
      }
      return backendMessage.split("\n")[0]; // Take only the first line
    }
  }

  // 2. Check for RTK Query internal error (e.g., parsing error, network error)
  const rtkError = err?.error;
  if (rtkError) {
    if (typeof rtkError === "string") {
      if (rtkError.includes("Unexpected token <") || rtkError.includes("is not valid JSON")) {
        return "Server returned an invalid response. Please try again later.";
      }
      return rtkError.split("\n")[0];
    }
  }

  // 3. Fallback
  return "An unexpected error occurred. Please try again.";
};

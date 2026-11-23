(() => {
  const config = window.SUQIA_AUTH_CONFIG || {};
  const apiBaseUrl = typeof config.apiBaseUrl === "string"
    ? config.apiBaseUrl.replace(/\/+$/, "")
    : "";
  let csrfToken = "";

  class AuthApiError extends Error {
    constructor(code, message, status) {
      super(message);
      this.name = "AuthApiError";
      this.code = code;
      this.status = status;
    }
  }

  const getCsrfToken = async () => {
    if (csrfToken) {
      return csrfToken;
    }

    let response;
    try {
      response = await fetch(`${apiBaseUrl}/auth/csrf`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
        headers: { Accept: "application/json" }
      });
    } catch {
      throw new AuthApiError("auth_service_unavailable", "The account service could not be reached.");
    }

    let result;
    try {
      result = await response.json();
    } catch {
      throw new AuthApiError(
        "invalid_auth_response",
        "The account service returned an invalid CSRF response.",
        response.status
      );
    }
    if (!response.ok || !result || typeof result.csrfToken !== "string" || !result.csrfToken) {
      throw new AuthApiError(
        result && typeof result.code === "string" ? result.code : "invalid_auth_response",
        "A valid CSRF token could not be obtained.",
        response.status
      );
    }

    csrfToken = result.csrfToken;
    return csrfToken;
  };

  const request = async (path, method, data) => {
    if (!apiBaseUrl) {
      throw new AuthApiError(
        "auth_not_configured",
        "The account service is not connected yet."
      );
    }

    let response;
    try {
      const headers = {
        Accept: "application/json",
        ...(data ? { "Content-Type": "application/json" } : {})
      };
      if (method !== "GET" && method !== "HEAD") {
        headers["X-CSRF-Token"] = await getCsrfToken();
      }
      response = await fetch(`${apiBaseUrl}${path}`, {
        method,
        credentials: "include",
        cache: "no-store",
        headers,
        body: data ? JSON.stringify(data) : undefined
      });
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }
      throw new AuthApiError(
        "auth_service_unavailable",
        "The account service could not be reached."
      );
    }

    let result;
    try {
      result = await response.json();
    } catch {
      throw new AuthApiError(
        "invalid_auth_response",
        "The account service returned an invalid response.",
        response.status
      );
    }

    if (!response.ok) {
      const message = result && typeof result.message === "string"
        ? result.message
        : "The request could not be completed.";
      throw new AuthApiError(
        result && typeof result.code === "string" ? result.code : "auth_request_failed",
        message,
        response.status
      );
    }

    return result;
  };

  const getSession = async () => {
    if (!apiBaseUrl) {
      return { available: false, user: null };
    }

    try {
      const result = await request("/auth/session", "GET");
      if (!result || !Object.prototype.hasOwnProperty.call(result, "user")) {
        throw new AuthApiError("invalid_auth_response", "The account service returned an invalid session.");
      }
      if (result.user === null) {
        return { available: true, user: null };
      }
      if (!result.user || typeof result.user.id !== "string") {
        throw new AuthApiError("invalid_auth_response", "The account service returned an invalid session.");
      }
      return { available: true, user: result.user };
    } catch (error) {
      if (error instanceof AuthApiError && error.status === 401) {
        return { available: true, user: null };
      }
      throw error;
    }
  };

  window.SUQIAAuth = Object.freeze({
    isConfigured: () => Boolean(apiBaseUrl),
    getSession,
    login: async (email, password, rememberMe) => {
      const result = await request("/auth/login", "POST", { email, password, rememberMe });
      csrfToken = "";
      return result;
    },
    register: async (name, email, password) => {
      const result = await request("/auth/register", "POST", { name, email, password });
      csrfToken = "";
      return result;
    },
    verifyEmail: (token) => request("/auth/verify", "POST", { token }),
    requestPasswordReset: (email) =>
      request("/auth/password/forgot", "POST", { email }),
    resetPassword: async (token, password) => {
      const result = await request("/auth/password/reset", "POST", { token, password });
      csrfToken = "";
      return result;
    },
    logout: async () => {
      const result = await request("/auth/logout", "POST");
      csrfToken = "";
      return result;
    },
    getProfile: () => request("/account/profile", "GET"),
    updateProfile: (profile) => request("/account/profile", "PATCH", profile),
    getOrders: () => request("/account/orders", "GET"),
    getServices: () => request("/account/services", "GET"),
    getSupportRequests: () => request("/account/support", "GET"),
    createSupportRequest: (requestDetails) =>
      request("/account/support", "POST", requestDetails),
    AuthApiError
  });
})();

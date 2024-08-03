/**
 * An Array of routes that are accesible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/"];

/**
 * An Array of routes that are used for authentication
 * These routes do not require authentication
 * @type {string[]}
 */
export const authRoutes = ["/auth"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for api authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for api authentication purposes
 * @type {string[]}
 */
export const apiUTPrefix = "/api/uploadthing";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";

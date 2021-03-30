const env = {
  URL_API: "http://example.com/wp-json/dp/v1",
  URL_AUTH: "http://example.com/wp-json/jwt-auth/v1",
  URL_REGISTER: "http://example.com/register", // string | false
  DOMAIN_MATOMO: "matomo.example.com", // string | false
  URL_OAUTH:
    "https://example.com/?option=oauthredirect&app_name=SERVICE&redirect_uri=http%3A%2F%2Fexample.com%2F",
  DEBUG_LOGIN: false,
  TRACKING_INSTRUMENTATION_KEY: "some-key", // string | false
  TRACKING_CONFIG: {} // object | false
}

export default env

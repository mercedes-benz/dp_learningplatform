<?php

namespace Simplicity\SSO;

use \Firebase\JWT\JWT;
use \WP_Error;

final class Base {
  /**
   * init
   */
  public static function init() {
    add_filter("allowed_redirect_hosts", __CLASS__ . "::allowed_redirect_hosts");
  }

  /**
   * Filter: allowed redirect hosts
   *
   * @param   array  $hosts  allowed hosts
   *
   * @return  array
   */
  public static function allowed_redirect_hosts($hosts) {
    if(defined("DP_FRONTEND_URL") && $url = parse_url(DP_FRONTEND_URL)) {
      $hosts[] = $url["host"];
    }

    return $hosts;
  }

  /**
   * generate token
   *
   * @return  string|WP_Error  jwt or wordpress error
   */
  public static function generate_token() {
    // check if user is logged in
    if (!\is_user_logged_in()) {
      return new WP_Error(
        "sso_not_logged_in",
        "User is not logged in",
        ["status" => 401]
      );
    }

    // check if wp jwt auth is active
    if (!class_exists("\Firebase\JWT\JWT")) {
      return new WP_Error(
        "sso_jwt_auth_not_loaded",
        "JWT Auth has not been loaded",
        ["status" => 501]
      );
    }

    $user = get_user_by("ID", get_current_user_id());

    if (!$user) {
      return new WP_Error(
        "sso_user_does_not_exist",
        "User does not exist",
        ["status" => 400]
      );
    }

    // check secret key
    $secret_key = defined("JWT_AUTH_SECRET_KEY") ? JWT_AUTH_SECRET_KEY : false;

    if (!$secret_key) {
      return new WP_Error(
        "sso_no_secret_key",
        "Auth secret key does not exist",
        ["status" => 501]
      );
    }

    // credentials
    $issuedAt = time();
    $notBefore = apply_filters("jwt_auth_not_before", $issuedAt, $issuedAt);
    $expire = apply_filters("jwt_auth_expire", $issuedAt + (DAY_IN_SECONDS * 7), $issuedAt);

    $token = [
      "iss" => get_bloginfo("url"),
      "iat" => $issuedAt,
      "nbf" => $notBefore,
      "exp" => $expire,
      "data" => [
        "user" => [
          "id" => $user->data->ID,
        ],
      ],
    ];

    return JWT::encode(apply_filters("jwt_auth_token_before_sign_sso", $token, $user), $secret_key);
  }

  /**
   * generate JWT and redirect to frontend
   *
   * @return  void
   */
  public static function generate_token_and_redirect() {
    $token = self::generate_token();

    if(is_wp_error($token)) {
      wp_die($token);
    }

    if(defined("DP_FRONTEND_URL")) {
      $current_lang = apply_filters("wpml_current_language", NULL);
      wp_safe_redirect(DP_FRONTEND_URL . "/{$current_lang}/oauth-login?token={$token}");
    }
  }

  /**
   * get user data by token
   *
   * @param   string  $token  JWT
   *
   * @return  array|WP_Error
   */
  public static function get_user_data($token) {
    $secret_key = defined("JWT_AUTH_SECRET_KEY") ? JWT_AUTH_SECRET_KEY : false;

    try {
      $decoded_token = JWT::decode($token, $secret_key, ["HS256"]);

      $user = get_user_by("ID", $decoded_token->data->user->id);

      $data = [
        "token" => $token,
        "user_email" => $user->data->user_email,
        "user_nicename" => $user->data->user_nicename,
        "user_display_name" => !empty($user->first_name) && !empty($user->last_name) ? "{$user->first_name} {$user->last_name}" : $user->data->display_name,
        "id" => $user->ID,
      ];

      return apply_filters("jwt_auth_token_before_dispatch", $data, $user);
    } catch (\Exception $e) {
      return new WP_Error(
        "sso_invalid_token",
        $e->getMessage(),
        ["status" => 403]
      );
    }
  }
}

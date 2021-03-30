<?php

namespace Simplicity\SSO;

use WP_Error;
use WP_Query;

final class REST {
  public static function init() {
    add_action("rest_api_init", __CLASS__ . "::register_rest_routes");
  }

  public static function register_rest_routes() {
    // dp/v1/sso/get_user_data
    register_rest_route("dp/v1", "/sso/get_user_data", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_get_user_data",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);
  }

  public static function rest_get_user_data() {
    list($token) = sscanf($_SERVER['HTTP_AUTHORIZATION'], "Bearer %s");

    $data = Base::get_user_data($token);
    return $data;
  }
}

<?php

namespace Simplicity;

final class Plugin {
  public static function init() {
    register_activation_hook(DP_PLUGIN_BASE_FILE, __CLASS__ . "::install");

    add_action("plugins_loaded", __CLASS__ . "::setup_hooks", -10);

    // Security / Media Access
    require_once DP_PLUGIN_DIR . "/classes/simplicity/security/media-access.php";

    // Security / Strip EXIF from images
    require_once DP_PLUGIN_DIR . "/classes/simplicity/security/strip-exif.php";
    Security\StripEXIF::init();

    // Plugin
    require_once DP_PLUGIN_DIR . "/classes/simplicity/rest.php";
    require_once DP_PLUGIN_DIR . "/classes/vc.php";

    REST::init();
    VC::init();

    // Knowledge
    require_once DP_PLUGIN_DIR . "/classes/simplicity/knowledge/base.php";

    Knowledge\Base::init();

    // Learning
    require_once DP_PLUGIN_DIR . "/classes/simplicity/learning/base.php";

    Learning\Base::init();

    // FAQ
    require_once DP_PLUGIN_DIR . "/classes/simplicity/faq/base.php";

    FAQ\Base::init();

    // Quiz
    require_once DP_PLUGIN_DIR . "/classes/simplicity/quiz/base.php";

    Quiz\Base::init();

    // Video
    require_once DP_PLUGIN_DIR . "/classes/simplicity/video/base.php";

    Video\Base::init();

    // SSO
    require_once DP_PLUGIN_DIR . "/classes/simplicity/sso/base.php";
    SSO\Base::init();
  }

  /**
   * install
   */
  public static function install() {
    Install::init();
  }

  /**
   * setup hooks
   */
  public static function setup_hooks() {
    // security
    add_action("plugins_loaded", "Simplicity\Security\MediaAccess::init", 11);

    // load textdomain
    add_action("plugins_loaded", __CLASS__ . "::load_textdomain", 11);

    // perform migration when in wp dashboard
    if(is_admin()) {
      add_action("plugins_loaded", __CLASS__ . "::detect_plugin_changes", 11);
    }

    // force oauth login
    add_action("plugins_loaded", __CLASS__ . "::force_oauth_login", 10);

    // remote login / logout
    add_action("init", __CLASS__ . "::log_into_backend", 1);
    add_action("plugins_loaded", __CLASS__ . "::maybe_logout", 1);

    // inject custom user roles
    add_action("after_setup_theme", __CLASS__ . "::inject_custom_user_roles", 50);

    // media
    add_filter("image_strip_meta", true);

    // maintain allowed MIME types
    add_filter("upload_mimes", __CLASS__ . "::upload_mimes", 100);

    // use ACF 5
    define('ACF_EARLY_ACCESS', '5');
    add_action("init", __CLASS__ . "::register_acf", 99);
    add_action("init", __CLASS__ . "::register_acf_menu", 99);

    // extension
    add_action("admin_menu", __CLASS__ . "::remove_admin_menus", 99);
    add_action("after_setup_theme", __CLASS__ . "::register_nav_menus");
    add_action("admin_menu", __CLASS__ . "::add_admin_menus");
    add_action("admin_enqueue_scripts", __CLASS__ . "::admin_custom_css");
    add_action("admin_enqueue_scripts", __CLASS__ . "::hide_admin_notifications");
    add_action("wp_dashboard_setup", __CLASS__ . "::manage_dashboard_widgets", 99);

    add_action("init", __CLASS__ . "::add_image_sizes");

    add_filter("dp/filter_acf_fields", __CLASS__ . "::filter_acf_fields", 10, 3);
    add_filter("dp/filter_acf_field/tag", __CLASS__ . "::filter_acf_tag", 10);
    add_filter("dp/filter_acf_field/learning_tag", __CLASS__ . "::filter_acf_learning_tag", 10);

    // jwt
    add_filter("jwt_auth_expire", __CLASS__ . "::jwt_auth_expire", 10);
    add_filter("jwt_auth_token_before_dispatch", __CLASS__ . "::jwt_auth_token_before_dispatch", 10, 2);

    // admin login
    add_filter("login_message", __CLASS__ . "::login_message");
    add_action("login_enqueue_scripts", __CLASS__ . "::login_customize");
    add_action("login_footer", __CLASS__ . "::login_footer");

    // registration email
    add_filter("wp_new_user_notification_email", __CLASS__ . "::new_user_notification_email", 10, 3);

    // fix wpml adding ?lang=XY to get_home_url
    add_filter("home_url", __CLASS__ . "::fix_wpml_jwt_bug", 10, 4);

    // filter links
    add_filter("post_type_link", __CLASS__ . "::post_type_link", 10, 4);
    add_filter("preview_post_link", __CLASS__ . "::preview_post_link", 10, 2);
    add_filter("page_link", __CLASS__ . "::page_link", 10, 3);
    add_filter("preview_post_link/page", __CLASS__ . "::preview_page_link", 10, 3);

    // add tinymce buttons
    add_filter("mce_buttons", __CLASS__ . "::add_tinymce_buttons", 99);
    add_filter("mce_external_plugins", __CLASS__ . "::add_tinymce_plugins");

    // downloads
    add_action("template_redirect", __CLASS__ . "::download_redirect");
    add_action("init", __CLASS__ . "::download_rewrite_rule");

    // password reset
    add_action("after_password_reset", __CLASS__ . "::lost_password_redirect");

    // allow user creation without email
    add_action("user_profile_update_errors" , __CLASS__ . "::user_profile_update_errors", 10, 3);
    add_action("user_new_form", __CLASS__ . "::user_form_optional_email", 10, 1);
    add_action("show_user_profile", __CLASS__ . "::user_form_optional_email", 10, 1);
    add_action("edit_user_profile", __CLASS__ . "::user_form_optional_email", 10, 1);

    // logout link
    add_filter("logout_url", __CLASS__ . "::logout_url", 100, 2);
  }

  /**
   * detects change of plugin version
   * -------
   * Saves the current version number of the plugin
   * if there is a difference of the local plugin version and the saved one
   * it will call a custom action for migration and save the new one.
   * The action listeners are defined in the class `Simplicity\Migrations`.
   *
   * @return void
   */
  public static function detect_plugin_changes() {
    if (!function_exists('get_plugins')) {
      require_once ABSPATH . 'wp-admin/includes/plugin.php';
    }

    $plugins = get_plugins();
    $current_plugin_basename = plugin_basename(DP_PLUGIN_BASE_FILE);

    if (isset($plugins[$current_plugin_basename])) {
      $current_plugin = $plugins[$current_plugin_basename];
      $recent_plugin_version = get_option("dp_recent_plugin_version");

      if (!$recent_plugin_version || $current_plugin["Version"] !== $recent_plugin_version) {
        // update option if not in testing environment
        if (!defined("DP_TEST_MIGRATION") || DP_TEST_MIGRATION !== true) {
          update_option("dp_recent_plugin_version", $current_plugin["Version"]);
        }

        // last migration
        $last_migration = get_option("dp_last_migration");

        // initial update
        do_action("dp/prepare_migrations", $last_migration, $current_plugin["Version"], $recent_plugin_version);

        return "success";
      } else {
        return "dupe";
      }
    } else {
      return "error";
    }
  }

  /**
   * logout user if GET-param logout is available
   */
  public static function maybe_logout() {
    if (isset($_GET["logout"])) {
      $host = self::get_frontend_host();

      header("Access-Control-Allow-Origin: $host");
      header("Access-Control-Allow-Credentials: true");
      \wp_logout();
      \status_header(200);
      \nocache_headers();
      die();
    }
  }

  /**
   * log into backend by JWT
   * set auth cookies for backend host
   *
   * @return  void
   */
  public static function log_into_backend() {
    if (isset($_GET["backend_login"])) {
      $host = self::get_frontend_host();

      header("Access-Control-Allow-Origin: $host");
      header("Access-Control-Allow-Credentials: true");

      $token = $_GET["token"];

      $user = SSO\Base::get_user_data($token);

      \wp_set_current_user($user["id"]);
      \wp_set_auth_cookie($user["id"], false, true);

      die();
    }
  }

  /**
   * force oauth login if DP_DEBUG_LOGIN is not set to true
   */
  public static function force_oauth_login() {
    if(!Helper::is_debug_login()) {
      // hide login form
      add_action("login_enqueue_scripts", function() {
?>
      <style type="text/css">
        #loginform {display: none}
      </style>
<?php
      });

      // disable login via form
      if (isset($_POST["log"]) && $_POST["log"]) {
        self::send_forbidden_header();
      }

      // disable password reset & register
      add_action("login_form_lostpassword", [__CLASS__, "send_forbidden_header"]);
      add_action("login_form_register", [__CLASS__, "send_forbidden_header"]);
      add_action("login_form_postpass", [__CLASS__, "send_forbidden_header"]);
      add_action("login_form_retrievepassword", [__CLASS__, "send_forbidden_header"]);
      add_action("login_form_rp", [__CLASS__, "send_forbidden_header"]);
      add_action("login_form_confirmaction", [__CLASS__, "send_forbidden_header"]);

      // disable jwt auth
      add_filter("jwt_auth_token_before_sign", function($token) {
        self::send_forbidden_header();
      });
    }
  }

  /**
   * send forbidden header
   */
  public static function send_forbidden_header() {
    \status_header(403);
    \nocache_headers();
    die();
  }

  /**
   * inject custom user roles
   * defined in options
   */
  public static function inject_custom_user_roles() {
    $roles = Helper::get_option("custom_roles");
    $builtin_roles = ["administrator", "editor", "author", "subscriber", "contributor", "subscriber", "translator"];

    if (!is_array($roles)) {
      return;
    }

    foreach ($roles as $role) {
      add_role(sanitize_title_with_dashes($role), $role, ["read" => true]);
    }

    // remove deprecated roles
    array_walk($roles, function (&$role) {
      $role = sanitize_title_with_dashes($role);
    });

    $deprecated_custom_user_roles = array_diff(Helper::get_custom_user_roles(), $roles);
    foreach ($deprecated_custom_user_roles as $role) {
      remove_role($role);
    }
  }

  /**
   * register acf for pages
   */
  public static function register_acf() {
    if (!function_exists("acf_add_local_field_group")) {
      return;
    }

    // page options
    acf_add_local_field_group([
      'key' => 'group_5b71958ceded7',
      'title' => __("Page options", "dp"),
      'fields' => [
        [
          'key' => 'field_5b7195978eae1',
          'label' => __("Authentification required", "dp"),
          'name' => 'auth_required',
          'type' => 'true_false',
          'instructions' => '',
          'required' => 0,
          'conditional_logic' => 0,
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'message' => __("User has to be authenticated to view or request this page", "dp"),
          'default_value' => 1,
          'ui' => 0,
          'ui_on_text' => '',
          'ui_off_text' => '',
        ],
      ],
      'location' => [
        [
          [
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'page',
          ],
        ],
      ],
      'menu_order' => 0,
      'position' => 'normal',
      'style' => 'default',
      'label_placement' => 'top',
      'instruction_placement' => 'label',
      'hide_on_screen' => '',
      'active' => 1,
      'description' => '',
    ]);
  }

  /**
   * register acf for nav menu items
   */
  public static function register_acf_menu() {
    if (!function_exists("acf_add_local_field_group")) {
      return;
    }

    acf_add_local_field_group([
      'key' => "group_5bed85e91747f",
      'title' => __("Menu", "dp"),
      'fields' => [
        [
          'key' => 'field_5bf57d69c4433',
          'label' => __('Title', 'dp'),
          'name' => 'preview_title',
          'type' => 'text',
          'instructions' => '',
          'required' => 0,
          'conditional_logic' => 0,
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'default_value' => '',
          'placeholder' => '',
          'prepend' => '',
          'append' => '',
          'maxlength' => '',
        ],
        [
          'key' => 'field_5bf57d2dc4432',
          'label' => __('Description', 'dp'),
          'name' => 'preview_description',
          'type' => 'textarea',
          'instructions' => '',
          'required' => 0,
          'conditional_logic' => 0,
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'default_value' => '',
          'placeholder' => '',
          'maxlength' => '',
          'rows' => '',
          'new_lines' => '',
        ],
        [
          'key' => 'field_5bf57d73c4434',
          'label' => __('Image', 'dp'),
          'name' => 'preview_image',
          'type' => 'image',
          'instructions' => '',
          'required' => 0,
          'conditional_logic' => 0,
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'return_format' => 'id',
          'preview_size' => 'thumbnail',
          'library' => 'uploadedTo',
          'min_width' => '',
          'min_height' => '',
          'min_size' => '',
          'max_width' => '',
          'max_height' => '',
          'max_size' => '',
          'mime_types' => '',
        ],
        [
          'key' => 'field_5bed85edf879e',
          'label' => __('Inherit items as children from', "dp"),
          'name' => 'sub',
          'type' => 'select',
          'instructions' => '',
          'required' => 0,
          'conditional_logic' => 0,
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'choices' => [
            'learning' => __("Academy", "dp"),
            'knowledge' => __("Library", "dp"),
          ],
          'default_value' => [
          ],
          'allow_null' => 1,
          'multiple' => 0,
          'ui' => 0,
          'return_format' => 'value',
          'ajax' => 0,
          'placeholder' => '',
        ],
      ],
      'location' => [
        [
          [
            'param' => 'nav_menu_item',
            'operator' => '==',
            'value' => 'location/main',
          ],
        ],
      ],
      'menu_order' => 0,
      'position' => 'normal',
      'style' => 'default',
      'label_placement' => 'top',
      'instruction_placement' => 'label',
      'hide_on_screen' => '',
      'active' => 1,
      'description' => '',
    ]);
  }

  /**
   * login footer links
   */
  public static function login_footer() {
    ?>
    <div id="backtofrontend">
      <a href="<?php echo DP_FRONTEND_URL; ?>"><?php _e("&larr; Back to SIMPLICITY", "dp");?></a>
    </div>
    <?php
}

  /**
   * login styles
   */
  public static function login_customize() {
    ?>
      <style type="text/css">
        #login h1 a {
          display: none;
        }

        #login #nav,
        #login #backtoblog {
          display: none;
        }

        #login h1 {
          display: block;
          height: 110px;
          background: top center url(<?php echo get_stylesheet_directory_uri(); ?>/assets/images/simplicity-logo-color.svg) no-repeat;
          background-size: 80px 80px;
        }

        #backtofrontend {
          margin-top: 30px;
          text-align: center;
        }
      </style>
    <?php
}

  /**
   * replace url in password reset message
   *
   * @param      string  $message  The message
   *
   * @return     string  Filtered message
   */
  public static function login_message($message) {
    $message = str_replace(get_bloginfo("wpurl") . "/wp-login.php", DP_FRONTEND_URL, $message);

    return $message;
  }

  /**
   * admin custom inline css
   */
  public static function admin_custom_css() {
    echo '<style type="text/css">
              .vc_save-backend #wpb-save-post {display: none !important;}
              .vc_save-backend .vc_control-preview {margin-right: 20px !important;}

              a[href="#knowledge_topic-pop"] {display: none;}

              #simplicity_dashboard_widget .simplicity-links {
                margin-bottom: 0;
              }

                #simplicity_dashboard_widget .simplicity-links li {
                  margin-bottom: 0;
                }

                  #simplicity_dashboard_widget .simplicity-links a {
                    box-sizing: border-box;
                    display: inline-block;
                    width: 100%;
                    padding: 30px 0;
                    text-align: center;
                    font-size: 1.5em;
                    color: #fff;
                    transition: all .2s ease-in-out;
                    letter-spacing: 4px;
                    text-transform: uppercase;
                  }

                    #simplicity_dashboard_widget .simplicity-links a:hover {
                      opacity: .85;
                    }

                    #simplicity_dashboard_widget .simplicity-links .knowledge {background-color: #573b98;}
                    #simplicity_dashboard_widget .simplicity-links .learning {background-color: #444da1;}
                    #simplicity_dashboard_widget .simplicity-links .faq {background-color: #2f5eab;}
          </style>
          ' . "\r\n";
  }

  /**
   * hide admin notifications
   */
  public static function hide_admin_notifications() {
    echo '<style type="text/css">.redux-notice, .try-gutenberg-panel, .welcome-panel, .vc_license-activation-notice {display: none !important;}</style>' . "\r\n";

    $user_roles = Helper::get_user_roles();

    if (!in_array("administrator", $user_roles)) {
      echo '<style type="text/css">#setting-error-tgmpa, .update-nag, .notice-warning, .notice-info, .settings-error {display: none !important;}</style>' . "\r\n";
    }
  }

  /**
   * remove dashboard widgets
   */
  public static function manage_dashboard_widgets() {
    global $wp_meta_boxes;

    // delete default dashboard widgets
    unset($wp_meta_boxes["dashboard"]["side"]["core"]["dashboard_quick_press"]);
    unset($wp_meta_boxes["dashboard"]["side"]["core"]["dashboard_primary"]);
    unset($wp_meta_boxes["dashboard"]["side"]["high"]["redux_dashboard_widget"]);
    unset($wp_meta_boxes["dashboard"]["normal"]["core"]["dashboard_right_now"]);
    unset($wp_meta_boxes["vc_grid_item"]["normal"]["high"]["wpb_visual_composer"]);

    // add new dashboard widget and set position
    wp_add_dashboard_widget("simplicity_dashboard_widget", __("SIMPLICITY", "dp"), __CLASS__ . "::simplicity_dashboard_widget");

    $wp_meta_boxes["dashboard"]["side"]["core"]["simplicity_dashboard_widget"] = $wp_meta_boxes["dashboard"]["normal"]['core']["simplicity_dashboard_widget"];
    unset($wp_meta_boxes["dashboard"]["normal"]['core']["simplicity_dashboard_widget"]);
  }

  /**
   * simplicity dashboard widget
   */
  public static function simplicity_dashboard_widget() {
    echo '<ul class="simplicity-links">'
        . '<li><a class="knowledge" href="' . admin_url("edit.php?post_type=knowledge") . '">' . __("Library", "dp") . '</a></li>'
        . '<li><a class="learning" href="' . admin_url("edit.php?post_type=learning") . '">' . __("Academy", "dp") . '</a></li>'
        . '<li><a class="faq" href="' . admin_url("edit.php?post_type=faq") . '">' . __("FAQ", "dp") . '</a></li>'
      . '</ul>';
  }

  /**
   * allowed upload MIME types
   */
  public static function upload_mimes($types) {
    if(!defined("DP_ALLOW_ARCHIVE_UPLOADS") || !DP_ALLOW_ARCHIVE_UPLOADS) {
      // remove archives
      unset($types["zip"]);
      unset($types["gz|gzip"]);
      unset($types["rar"]);
      unset($types["7z"]);
      unset($types["tar"]);
    }

    return $types;
  }

  /**
   * loads textdomain
   */
  public static function load_textdomain() {
    load_plugin_textdomain('dp', false, plugin_basename(dirname(dirname(dirname(__FILE__)))) . "/lang");
  }

  /**
   * Adds admin menu pages
   */
  public static function add_admin_menus() {
    // menus as menu page
    add_menu_page(
      __("Menus", "dp"),
      __("Menus", "dp"),
      "edit_theme_options",
      "nav-menus.php",
      "",
      "dashicons-menu",
      61
    );

    // themes as submenu page of settings
    add_submenu_page(
      "options-general.php",
      __("Themes", "dp"),
      __("Themes", "dp"),
      "edit_theme_options",
      "themes.php",
      "",
      20
    );
  }

  /**
   * Registers nav menus
   */
  public static function register_nav_menus() {
    register_nav_menus([
      "main" => __("Main menu", "dp"),
      "footer" => __("Footer menu", "dp"),
      "footer_logged_out" => __("Footer menu (logged out)", "dp"),
    ]);
  }

  /**
   * Adds image sizes
   */
  public static function add_image_sizes() {
    add_image_size("dp-gallery", 540, 400, true);
    add_image_size("dp-category", 600, 360, true);
    add_image_size("dp-article", 480, 320, true);
    add_image_size("dp-menu", 768, 330, true);
  }

  /**
   * removes admin menu pages
   */
  public static function remove_admin_menus() {
    remove_menu_page("index.php");
    remove_menu_page("edit.php");
    remove_menu_page("edit-comments.php");
    remove_menu_page("themes.php");

    $userdata = get_userdata(get_current_user_id());

    if (!in_array("administrator", $userdata->roles)) {
      remove_menu_page("tools.php");
      remove_menu_page("vc-welcome");
    }
  }

  /**
   * Filter: acf field values
   * @param  array $fields      Fields
   * @param  string $image_size Image size
   * @return array              Filtered fields
   */
  public static function filter_acf_fields($fields, $image_size = "large", $exclude_keys = []) {
    if (!is_array($fields) && !is_object($fields)) {
      return;
    }

    $result = new \stdClass();

    foreach ($fields as $field_name => $field_value) {
      if (in_array($field_name, $exclude_keys)) {
        continue;
      }

      if ($field_value["type"] == "image") {
        $field_value["value"] = wp_get_attachment_image_url($field_value["value"], $image_size);
      } elseif ($field_value["type"] == "relationship") {
        if (is_string($field_value["value"])) {
          $field_value["value"] = [];
        } else {
          foreach ($field_value["value"] as &$post) {
            $new_post = [
              "ID" => $post->ID,
              "post_title" => $post->post_title,
              "post_excerpt" => $post->post_excerpt | "",
              "post_name" => $post->post_name,
              "post_date" => $post->post_date,
              "post_date_gmt" => $post->post_date_gmt,
              "post_thumbnail" => get_the_post_thumbnail_url($post, "dp-article"),
              "fields" => apply_filters("dp/filter_acf_fields", get_field_objects($post), "dp-article", ["linked_{$post->post_type}_articles"]),
            ];

            $post = $new_post;
          }
        }
      }

      $result->{$field_name} = apply_filters("dp/filter_acf_field/{$field_name}", $field_value["value"]);
    }

    return $result;
  }

  /**
   * Filter: get knowledge article tag name by key
   *
   * @param      string  $tag_key  The tag key
   *
   * @return     string            The tag name
   */
  public static function filter_acf_tag($tag_key) {
    $tags = Helper::get_knowledge_tags();

    if(is_array($tag_key)) {
      foreach($tag_key as &$k) {
        if(isset($tags[$k])) {
          $k = $tags[$k];
        } else {
          continue;
        }
      }
      return $tag_key;
    } else {
      if (!isset($tags[$tag_key])) {
        return [$tag_key];
      } else {
        return [$tags[$tag_key]];
      }
    }
  }

  /**
   * Filter: get learning article tag name by key
   *
   * @param      string  $tag_key  The tag key
   *
   * @return     string            The tag name
   */
  public static function filter_acf_learning_tag($tag_key) {
    $tags = Helper::get_learning_tags();

    if (!isset($tags[$tag_key])) {
      return $tag_key;
    } else {
      return $tags[$tag_key];
    }
  }

  /**
   * add avatar url to jwt token
   * add display_name based on first_name and last_name
   *
   * @param  array  $token token
   * @param  object $user  user data
   * @return array         token
   */
  public static function jwt_auth_token_before_dispatch($token, $user) {
    // set avatar url
    if (function_exists("has_wp_user_avatar")) {
      $token["avatar"] = has_wp_user_avatar($user->ID) ? get_wp_user_avatar_src($user->data->ID, 96) : get_avatar_url($user->data->ID);
    } else {
      $token["avatar"] = get_avatar_url($user->ID);
    }

    // set display name
    $token["user_display_name"] = !empty($user->first_name) && !empty($user->last_name) ? "{$user->first_name} {$user->last_name}" : $user->data->display_name;

    return $token;
  }

  /**
   * override jwt expiration time
   * @param  int $exp expiration time
   * @return int      expiration time
   */
  public static function jwt_auth_expire($exp) {
    return time() + (DAY_IN_SECONDS * 2); // same as cookie expiration
  }

  /**
   * Filter: new user notification mail
   *
   * @param   array   $email     E-Mail
   * @param   object  $user      User
   * @param   string  $blogname  Blog name
   *
   * @return  array              E-Mail
   */
  public static function new_user_notification_email($email, $user, $blogname) {
    $email["subject"] = sprintf(__("Your account has been created on %s", "dp"), $blogname);

    // see wp-includes/pluggable.php, function wp_new_user_notification() for more details
    // ---
    // Generate something random for a password reset key.
    global $wpdb;

    $key = wp_generate_password(20, false);

    /** This action is documented in wp-login.php */
    do_action('retrieve_password_key', $user->user_login, $key);

    // Now insert the key, hashed, into the DB.
    if (empty($wp_hasher)) {
      require_once ABSPATH . WPINC . '/class-phpass.php';
      $wp_hasher = new \PasswordHash(8, true);
    }
    $hashed = time() . ':' . $wp_hasher->HashPassword($key);
    $wpdb->update($wpdb->users, ['user_activation_key' => $hashed], ['user_login' => $user->user_login]);

    $switched_locale = switch_to_locale(get_user_locale($user));

    /* translators: %s: user login */
    $message = sprintf(__('Your username: %s', "dp"), $user->user_login) . "\r\n\r\n";
    $message .= __('To set your password, visit the following address:', "dp") . "\r\n\r\n";
    $message .= network_site_url("wp-login.php?action=rp&key=$key&login=" . rawurlencode($user->user_login), 'login') . "\r\n\r\n";

    $message .= sprintf(__("Visit %s: %s", "dp"), $blogname, DP_FRONTEND_URL) . "\r\n";

    $email["message"] = $message;

    return $email;
  }

  /**
   * fix wpml / jwt auth bug
   * -----------------------
   * WPML adds a ?lang=en to get_bloginfo("url")
   * which makes the jwt iss' invalid
   * if we want to query stuff for other languages
   *
   * @param   string    $url          url
   * @param   string    $path         path
   * @param   string    $orig_scheme  scheme
   * @param   int|null  $blog_id      blog id or null
   *
   * @return  string                  filtered url
   */
  public static function fix_wpml_jwt_bug($url, $path, $orig_scheme, $blog_id) {
    $url = preg_replace("/\/\?lang=([a-z0-9-_]+)/i", "", $url);
    $url = preg_replace("/\/([a-z0-9-_]+)\//i", "", $url); //
    return $url;
  }

  /**
   * post type link
   *
   * @param   string  $post_link  post link
   * @param   object  $post       post
   * @param   bool    $leavename  if name should be the same
   * @param   bool    $sample     is sample link
   *
   * @return  string              filtered post link
   */
  public static function post_type_link($post_link, $post, $leavename = false, $sample) {
    if(defined("DP_FRONTEND_URL") && function_exists("wpml_get_language_information") && $post->ID) {
      $wpml_lang = wpml_get_language_information($post->ID);
      if(is_object($wpml_lang)) {
        $lang_code = defined("ICL_LANGUAGE_CODE") ? ICL_LANGUAGE_CODE : "de";
      } else {
        $lang_code = $wpml_lang["language_code"];
      }

      $post_link = apply_filters("post_type_link/{$post->post_type}", $post_link, $post, $lang_code);

      if(!$sample) {
        $post_link = str_replace("%pagename%", $post->post_name, $post_link);
      }
    }

    return $post_link;
  }

  /**
   * preview post link
   *
   * @param   string  $preview_link  preview link
   * @param   object  $post          post
   *
   * @return  string                 filtered preview link
   */
  public static function preview_post_link($preview_link, $post) {
    if(defined("DP_FRONTEND_URL") && function_exists("wpml_get_language_information")) {
      $wpml_lang = wpml_get_language_information($post->ID);
      if(is_object($wpml_lang)) {
        $lang_code = defined("ICL_LANGUAGE_CODE") ? ICL_LANGUAGE_CODE : "de";
      } else {
        $lang_code = $wpml_lang["language_code"] ? $wpml_lang["language_code"] : ICL_LANGUAGE_CODE;
      }

      $preview_link = apply_filters("preview_post_link/{$post->post_type}", $preview_link, $post, $lang_code);
    }

    return $preview_link;
  }

  /**
   * page link
   *
   * @param   string  $page_link  page link with placeholder
   * @param   int     $post_id    post id
   * @param   bool    $sample     is sample link
   *
   * @return  string              filtered page link with placeholder
   */
  public static function page_link($page_link, $post_id, $sample) {
    if(defined("DP_FRONTEND_URL") && function_exists("wpml_get_language_information") && $post_id) {
      $wpml_lang = wpml_get_language_information($post_id);
      if(is_object($wpml_lang)) {
        $lang_code = defined("ICL_LANGUAGE_CODE") ? ICL_LANGUAGE_CODE : "de";
      } else {
        $lang_code = $wpml_lang["language_code"] ? $wpml_lang["language_code"] : ICL_LANGUAGE_CODE;
      }

      $post = get_post($post_id);
      $page_link = str_replace("%pagename%", $post->post_name, DP_FRONTEND_URL . "/{$lang_code}/page/%pagename%/");
    }

    return $page_link;
  }

  /**
   * preview page link
   * --------
   * when page is drafted without setting a post name
   *
   * @param   string  $preview_link  preview link
   * @param   object  $post          the post
   * @param   string  $lang_code     wpml language code
   *
   * @return  string                 filtered preview link
   */
  public static function preview_page_link($preview_link, $post, $lang_code) {
    if($post->post_name === "") {
      return DP_FRONTEND_URL . "/{$lang_code}/page/{$post->ID}/?preview&use_id";
    } else {
      return $preview_link;
    }
  }

  /**
   * add tinymce buttons
   *
   * @param   array  $buttons  registered buttons
   *
   * @return  array            filtered buttons
   */
  public static function add_tinymce_buttons($buttons) {
    // remove buttons
    $to_delete = ["wpUserAvatar", "wp_adv"];

    foreach($buttons as $k => $val) {
      if(in_array($val, $to_delete)) {
        unset($buttons[$k]);
      }
    }

    // add buttons
    array_push($buttons, "separator", "table");
    array_push($buttons, "separator", "wp_adv");

    return $buttons;
  }

  /**
   * add tinymce plugins
   *
   * @param   array  $plugins  registered plugins
   *
   * @return  array            filtered plugins
   */
  public static function add_tinymce_plugins($plugins) {
    $plugins["table"] = DP_PLUGIN_URL . "assets/tinymce/table/plugin.min.js";

    return $plugins;
  }

  /**
   * download redirect
   * -------
   * if query var "dps_download" exists
   * it will look for the attachment and force download it
   *
   * @return  void
   */
  public static function download_redirect() {
    global $wp_query;

    if(!empty(get_query_var("dps_download"))) {
      $download_slug = get_query_var("dps_download");

      $attachments = get_posts([
        "post_type" => "attachment",
        "name" => $download_slug,
        "numberposts" => 1
      ]);

      if(!empty($attachments)) {
        $attachment = $attachments[0];
        $attachment_url = $attachment->guid;
        $upload_dir = wp_get_upload_dir();
        $file = str_replace($upload_dir["baseurl"], $upload_dir["basedir"], $attachment_url);
        $filename = basename($file);

        if (file_exists($file)) {
          status_header(200);
          header('Content-Description: File Transfer');
          header('Content-Type: application/force-download');
          header('Content-Disposition: attachment; filename="'.basename($file).'"');
          header('Expires: 0');
          header('Cache-Control: must-revalidate');
          header('Pragma: public');
          header('Content-Length: ' . filesize($file));
          wp_ob_end_flush_all();
          readfile($file);
          exit;
        }
      }
      // 404 is default
    }
  }

  /**
   * download rewrite rule & tag
   *
   * @return  void
   */
  public static function download_rewrite_rule() {
    add_rewrite_tag("%dps_download%", "([^/]+)");
    add_rewrite_rule('^download/([^/]+)/?$', 'index.php?pagename=download&dps_download=$matches[1]', "top");
  }

  /**
   * redirect user to frontend after set new password
   *
   * @return  void
   */
  public static function lost_password_redirect() {
    wp_redirect(DP_FRONTEND_URL);
    exit;
  }

  /**
   * user profile update errors
   *
   * @param   WP_Error  $errors  errors
   * @param   bool      $update  is update?
   * @param   object    $user    user
   *
   * @return  void
   */
  public static function user_profile_update_errors($errors, $update, $user) {
    $errors->remove("empty_email");
  }

  /**
   * make email optional for users
   *
   * @param   string  $form_type  form type
   *
   * @return  void
   */
  public static function user_form_optional_email($form_type) {
    ?>
    <script type="text/javascript">
        jQuery('#email').closest('tr').removeClass('form-required').find('.description').remove();
        // Uncheck send new user email option by default
        <?php if (isset($form_type) && $form_type === "add-new-user"): ?>
            jQuery('#send_user_notification').removeAttr('checked');
        <?php endif;?>
    </script>
    <?php
  }

  /**
   * logout url
   *
   * @param   string  $logout_url  logout url
   * @param   string  $redirect    path to redirect
   *
   * @return  string               new logout url
   */
  public static function logout_url($logout_url, $redirect) {
    if(!defined("DP_FRONTEND_URL")) return $logout_url;

    $current_lang = apply_filters("wpml_current_language", NULL);

    return untrailingslashit(DP_FRONTEND_URL) . "/{$current_lang}/logout";
  }

  /**
   * get frontend host for CORS
   * ---
   * parses constant DP_FRONTEND_URL
   * if DP_FRONTEND_URL doesn't exist, returns wildcard
   *
   * @return  string  scheme + host
   */
  private static function get_frontend_host() {
    $host = "*";

    if (defined("DP_FRONTEND_URL") && $url = parse_url(DP_FRONTEND_URL)) {
      $host = $url["scheme"] . "://" . $url["host"];

      if (isset($url["port"]) && !in_array($url["port"], [80, 443])) {
        $host .= ":" . $url["port"];
      }
    }

    return $host;
  }
}

Plugin::init();

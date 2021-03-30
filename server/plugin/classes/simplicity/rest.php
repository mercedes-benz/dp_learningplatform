<?php

namespace Simplicity;

final class REST {
  public static function init() {
    // remove default rest routes
    remove_action('rest_api_init', 'create_initial_rest_routes', 99);

    // initalize custom api routes
    add_action("rest_api_init", __CLASS__ . "::register_rest_routes");

    // knowledge
    require_once DP_PLUGIN_DIR . "/classes/simplicity/knowledge/rest.php";
    Knowledge\REST::init();

    // learning
    require_once DP_PLUGIN_DIR . "/classes/simplicity/learning/rest.php";
    Learning\REST::init();

    // faq
    require_once DP_PLUGIN_DIR . "/classes/simplicity/faq/rest.php";
    FAQ\REST::init();

    // sso
    require_once DP_PLUGIN_DIR . "/classes/simplicity/sso/rest.php";
    SSO\REST::init();
  }

  /**
   * check if user is logged in for REST API calls
   *
   * @return     \WP_Error|boolean  either \WP_Error or success
   */
  public static function rest_check_user_logged_in() {
    if (!is_user_logged_in()) {
      return new \WP_Error(
        "[dps] authentification required",
        "you must be authenticated to request topics and modules",
        ["status" => 401]
      );
    }

    return true;
  }

  /**
   * registers rest routes
   */
  public static function register_rest_routes() {
    // dp/v1/pages/:slug
    register_rest_route("dp/v1", "/pages/(?P<slug>.+)", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_pages_by_slug",
    ]);

    // dp/v1/menus/:slug
    register_rest_route("dp/v1", "/menus/(?P<slug>.+)", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_menus_by_slug",
    ]);

    // dp/v1/search
    register_rest_route("dp/v1", "/search", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_search",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/bookmarks
    register_rest_route("dp/v1", "/bookmarks", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_bookmarks",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/bookmarks/add/:article_id
    register_rest_route("dp/v1", "/bookmarks/add", [
      "methods" => "POST",
      "callback" => __CLASS__ . "::rest_bookmarks_add",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/bookmarks/remove/:article_id
    register_rest_route("dp/v1", "/bookmarks/remove", [
      "methods" => "POST",
      "callback" => __CLASS__ . "::rest_bookmarks_remove",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/bookmarks/number
    register_rest_route("dp/v1", "/bookmarks/number", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_bookmarks_number",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/user/upload-avatar
    register_rest_route("dp/v1", "/user/upload-avatar", [
      "methods" => "POST",
      "callback" => __CLASS__ . "::rest_user_upload_avatar",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/user
    register_rest_route("dp/v1", "/user", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_user",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/user/certificates
    register_rest_route("dp/v1", "/user/certificates", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_user_certificates",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/likes/add
    register_rest_route("dp/v1", "/likes/add", [
      "methods" => "POST",
      "callback" => __CLASS__ . "::rest_likes_add",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/likes/remove
    register_rest_route("dp/v1", "/likes/remove", [
      "methods" => "POST",
      "callback" => __CLASS__ . "::rest_likes_remove",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/migrations/run
    register_rest_route("dp/v1", "/migrations/run", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_migrations_run",
    ]);
  }

  /**
   * REST: get menus by location slug
   *
   * @param      array  $request  The request
   *
   * @return     array  nav menu
   */
  public static function rest_menus_by_slug($request) {
    $slug = strtolower($request["slug"]);
    $locations = get_nav_menu_locations();
    $nav_menu = [];

    $menu_term = wp_get_nav_menu_object($locations[$slug]);
    if (!$menu_term) {
      return new \WP_Error(
        "[dps] menu location does not exist",
        "the requested menu location '{$slug}' does not exist",
        ["status" => 404]
      );
    }

    $wp_nav_items = wp_get_nav_menu_items($menu_term);

    foreach ($wp_nav_items as $nav_item) {
      $new_item = [
        "id" => $nav_item->ID,
        "url" => $nav_item->url,
        "title" => $nav_item->title,
        "sub" => get_field("sub", $nav_item),
        "preview_title" => get_field("preview_title", $nav_item),
        "preview_description" => get_field("preview_description", $nav_item),
        "preview_image" => wp_get_attachment_image_url(get_field("preview_image", $nav_item), "dp-menu"),
      ];

      // add children if custom field "sub" is set
      switch ($new_item["sub"]) {
      case "learning":
        $new_item["children"] = \Simplicity\Learning\REST::rest_learning_topics();
        break;

      case "knowledge":
        $new_item["children"] = \Simplicity\Knowledge\REST::rest_knowledge_categories();
        break;

      default:
        $new_item["children"] = [];
      }

      // put in array, check if it's a child entry
      if ($nav_item->menu_item_parent == "0") {
        $nav_menu["item-{$nav_item->ID}"] = $new_item;
      } else {
        $nav_menu["item-{$nav_item->menu_item_parent}"]["children"][] = $new_item;
      }
    }

    return $nav_menu;
  }

  /**
   * REST: page by slug
   *
   * @param      object  $request  WP_Request
   *
   * @return     array  Page
   */
  public static function rest_pages_by_slug($request) {
    if (!method_exists("WPBMap", "addAllMappedShortcodes")) {
      return new \WP_Error(
        "[dps] wpbmap is not initialized",
        "",
        ["status" => 501]
      );
    }

    \WPBMap::addAllMappedShortcodes();

    $slug = $request["slug"];
    $lang = $request["lang"];
    $query = $request->get_query_params();
    $has_permission = false;

    if (!isset($query["use_id"])) {
      $page_by_path = get_page_by_path($slug);
      $page = get_page(icl_object_id($page_by_path->ID, "page", true, $lang));
    } else {
      $page = get_post($slug, [
        "post_status" => ["draft", "publish"],
      ]);
    }

    // preview
    if (isset($query["preview"]) && current_user_can("edit_pages")) {
      if ($revisions = wp_get_post_revisions($page->ID)) {
        $last_revision = reset($revisions);
        $rev = wp_get_post_revision($last_revision->ID);
        $page->post_content = $rev->post_content;
        $page->post_title = $rev->post_title;
      }

      $has_permission = true;
    }

    if ($page == null || ($page->post_status !== "publish" && !$has_permission)) {
      return new \WP_Error(
        "[dps] page not found",
        "the requested page does not exist",
        ["status" => 404]
      );
    }

    $auth_required = get_field("auth_required", $page->ID);
    if ($auth_required === NULL) {
      $auth_required = true;
    }

    if ($auth_required && !is_user_logged_in()) {
      return new \WP_Error(
        "[dps] authentification required",
        "you must be authenticated to view or request this page",
        ["status" => 401]
      );
    }

    $page->post_content = apply_filters("the_content", $page->post_content, $page->ID);

    // get page translations
    $page->translations = Helper::get_post_translations($page->ID, "page");

    return $page;
  }

  /**
   * REST: search
   *
   * @param      object  $request  WP_Request
   *
   * @return     array  Results
   */
  public static function rest_search($request) {
    $query = $request->get_query_params();
    $term = urldecode($query["q"]);

    if(empty(trim($term))) {
      return new \WP_Error(
        "[dps] search query empty",
        "you must provide a valid query to search",
        ["status" => 400]
      );
    }

    $search_args = [
      "s" => $term,
      "posts_per_page" => (isset($query["posts_per_page"]) ? absint($query["posts_per_page"]) : 9),
      "offset" => (isset($query["offset"]) ? absint($query["offset"]) : 0),
      "post_type" => [],
      "tax_query" => [],
    ];

    $search_query = new \WP_Query(apply_filters("dp/search_args", $search_args));

    \WPBMap::addAllMappedShortcodes();

    relevanssi_do_query($search_query);

    $results = [];

    foreach ($search_query->posts as $post) {
      $result = apply_filters("dp/search_result/{$post->post_type}", [
        "ID" => $post->ID,
        "post_title" => $post->post_title,
        "post_excerpt" => $post->post_excerpt | "",
        "post_type" => $post->post_type,
        "post_name" => $post->post_name,
        "post_date" => $post->post_date,
        "post_date_gmt" => $post->post_date_gmt,
        "post_thumbnail" => get_the_post_thumbnail_url($post, "dp-article"),
      ], $post);

      $results[] = $result;
    }

    // other types search count
    $search_others_args = [
      "s" => $term,
      "posts_per_page" => -1,
      "offset" => 0,
      "post_type" => [],
      "tax_query" => [],
      "fields" => "ids",
    ];

    $search_others_query = new \WP_Query(apply_filters("dp/search_others_args", $search_others_args));

    relevanssi_do_query($search_others_query);

    return [
      "query_vars" => [
        "s" => $search_query->query_vars["s"],
        "order" => $search_query->query_vars["order"],
        "offset" => $search_query->query_vars["offset"],
        "posts_per_page" => $search_query->query_vars["posts_per_page"],
        "cache_results" => $search_query->query_vars["cache_results"],
        "posts_found" => $search_query->found_posts,
        "max_num_pages" => $search_query->max_num_pages,
      ],
      "others" => [
        "posts_found" => $search_others_query->found_posts,
      ],
      "results" => $results,
    ];
  }

  /**
   * REST: get bookmarks
   *
   * @param   object  $request  WP_Request
   *
   * @return  array             bookmarks, number of bookmarks
   */
  public static function rest_bookmarks($request) {
    $query = $request->get_query_params();

    $lang = (isset($query["lang"])) ? $query["lang"] : "de";
    $user = wp_get_current_user();

    global $wpdb;

    // get bookmarks
    $bookmarks = $wpdb->get_col(
      $wpdb->prepare("SELECT article_id FROM {$wpdb->prefix}bookmarks WHERE user_id = '%d' AND lang = '%s' ORDER BY inserted_at DESC;", $user->ID, $lang)
    );

    // return empty bookmarks
    if(count($bookmarks) === 0) {
      return ["bookmarks" => [], "num_bookmarks" => 0];
    }

    $articles = get_posts([
      "include" => $bookmarks,
      "post_type" => ["learning", "knowledge"],
      "orderby" => "post__in",
      "numberposts" => -1,
    ]);

    foreach ($articles as &$article) {
      $taxonomy = $article->post_type === "learning" ? "learning_topic" : "knowledge_category";
      $module_or_subcat = $article->post_type === "learning" ? "module" : "subcategory";
      $topic_or_cat = $article->post_type === "learning" ? "topic" : "category";

      // add module or subcategory
      $m = get_the_terms($article->ID, $taxonomy)[0];
      $article->{$module_or_subcat} = $m;

      // add topic or category
      $t = get_term($m->parent, $taxonomy);
      $article->{$topic_or_cat} = $t;

      $article->fields = apply_filters("dp/filter_acf_fields", get_field_objects($article), "dp-article");
    }

    return [
      "bookmarks" => $articles,
      "num_bookmarks" => count($articles),
    ];
  }

  /**
   * REST: add bookmark
   *
   * @param      object  $request  WP_Request
   *
   * @return     array  status, number of bookmarks
   */
  public static function rest_bookmarks_add($request) {
    $json_params = $request->get_json_params();
    $article_id = $json_params["article_id"];

    global $wpdb;

    $query_exists = "SELECT COUNT(ID) FROM {$wpdb->posts} WHERE ID = %d AND post_status = 'publish' AND (post_type = 'learning' OR post_type = 'knowledge');";
    $article_exists = $wpdb->get_var($wpdb->prepare($query_exists, $article_id));

    if (!$article_exists) {
      return ["status" => "not_found"];
    }

    $language_details = apply_filters("wpml_post_language_details", NULL, $article_id);
    $lang_code = $language_details["language_code"];
    $user = wp_get_current_user();

    $data = [
      "article_id" => $article_id,
      "user_id" => $user->ID,
      "lang" => $lang_code,
      "inserted_at" => current_time("mysql"),
    ];

    // force suppress wpdb errors for next query
    $wpdb->suppress_errors(true);

    $query_insert = $wpdb->insert("{$wpdb->prefix}bookmarks", $data, [
      "article_id" => "%d",
      "user_id" => "%d",
      "lang" => "%s",
      "inserted_at" => "%s",
    ]);

    // enable print errors
    $wpdb->suppress_errors(WP_DEBUG);

    if ($query_insert) {
      $query_num_bookmarks = "SELECT COUNT(bookmark_id) FROM {$wpdb->prefix}bookmarks WHERE user_id = '%d' AND lang = '%s';";
      $num_bookmarks = $wpdb->get_var($wpdb->prepare($query_num_bookmarks, $user->ID, $lang_code));

      return ["status" => "success", "num_bookmarks" => $num_bookmarks];
    } else {
      return ["status" => "error"];
    }
  }

  /**
   * REST: remove bookmarks
   *
   * @param   object  $request  WP_Request
   *
   * @return  array             result
   */
  public static function rest_bookmarks_remove($request) {
    $json_params = $request->get_json_params();
    $query = $request->get_query_params();
    $article_id = $json_params["article_id"];
    $remove_all = $json_params["remove_all"];
    $lang = isset($query["lang"]) ? $query["lang"] : "de";

    $user = wp_get_current_user();

    global $wpdb;

    if ($article_id) {
      return self::remove_single_article($article_id, $user->ID, $lang);
    } elseif ($remove_all) {
      return self::remove_all_bookmarks($user->ID, $lang);
    } else {
      return ["status" => "invalid"];
    }
  }

  /**
   * REST: number of bookmarks
   *
   * @param   object  $request  WP_Request
   *
   * @return  array             number of bookmarks
   */
  public static function rest_bookmarks_number($request) {
    $query = $request->get_query_params();

    $lang = (isset($query["lang"])) ? $query["lang"] : "de";
    $user = wp_get_current_user();

    return [
      "num_bookmarks" => self::get_number_of_bookmarks($user->ID, $lang),
    ];
  }

  /**
   * REST: upload user avatar
   *
   * @param   object  $request  WP_REST_Request
   *
   * @return  array             result
   */
  public static function rest_user_upload_avatar($request) {
    $file_params = $request->get_file_params();

    if (!isset($file_params["avatar"]) || empty($file_params["avatar"])) {
      return new \WP_Error(
        "[dps] empty request",
        "you must select an image",
        ["status" => 400]
      );
    }

    $uploaded_avatar = $file_params["avatar"];

    if (!preg_match("/^image\//i", $uploaded_avatar["type"])) {
      return new \WP_Error(
        "[dps] unsupported media type",
        "you must select an image",
        ["status" => 415]
      );
    }

    // move uploaded file
    $avatar_file = wp_handle_upload($uploaded_avatar, ["test_form" => false]);

    if ($avatar_file && isset($avatar_file["error"]) || !$avatar_file) {
      return new \WP_Error(
        "[dps] file upload error",
        "error while processing file",
        "500"
      );
    }

    // insert uploaded image as attachment
    $wp_upload_dir = wp_upload_dir();

    $attachment = [
      "guid" => $wp_upload_dir["url"] . "/" . basename($avatar_file["file"]),
      "post_mime_type" => $avatar_file["type"],
      "post_title" => preg_replace('/\.[^.]+$/', '', basename($avatar_file["file"])),
      "post_content" => "",
      "post_status" => "trash",
    ];

    $attach_id = wp_insert_attachment($attachment, $avatar_file["file"]);

    if (!function_exists("wp_generate_attachment_metadata")) {
      require_once ABSPATH . "wp-admin/includes/image.php";
    }

    // generate & update meta data
    $attach_data = wp_generate_attachment_metadata($attach_id, $avatar_file["file"]);
    wp_update_attachment_metadata($attach_id, $attach_data);

    // set user avatar
    update_user_meta(get_current_user_id(), "wp_user_avatar", $attach_id);

    $avatar_thumbnail_url = wp_get_attachment_image_url($attach_id, "thumbnail");

    return ["status" => "success", "avatar" => $avatar_thumbnail_url];
  }

  /**
   * REST: user data
   *
   * @return  array  result
   */
  public static function rest_user() {
    $user = wp_get_current_user();

    return ["status" => "success", "user" => array_merge((array) $user->data, [
      "roles" => (array) $user->roles,
      "display_name" => !empty($user->first_name) && !empty($user->last_name) ? "{$user->first_name} {$user->last_name}" : $user->data->display_name
    ])];
  }

  /**
   * REST: add like
   *
   * @param   array  $request  WP_REST_Request
   *
   * @return  array            result
   */
  public static function rest_likes_add($request) {
    $json_params = $request->get_json_params();
    $article_id = (int)$json_params["article_id"];

    global $wpdb;

    $query_exists = "SELECT COUNT(ID) FROM {$wpdb->posts} WHERE ID = %d AND post_status = 'publish' AND (post_type = 'learning' OR post_type = 'knowledge');";
    $article_exists = $wpdb->get_var($wpdb->prepare($query_exists, $article_id));

    if (!$article_exists) {
      return ["status" => "not_found"];
    }

    $user = wp_get_current_user();

    $data = [
      "article_id" => $article_id,
      "user_id" => $user->ID,
      "inserted_at" => current_time("mysql"),
    ];

    // force suppress wpdb errors for next query
    $wpdb->suppress_errors(true);

    $query_insert = $wpdb->insert("{$wpdb->prefix}likes", $data, [
      "article_id" => "%d",
      "user_id" => "%d",
      "inserted_at" => "%s",
    ]);

    // enable print errors
    $wpdb->suppress_errors(WP_DEBUG);

    if ($query_insert) {
      $query_num_likes = "SELECT COUNT(like_id) FROM {$wpdb->prefix}likes WHERE article_id = '%d';";
      $num_likes = $wpdb->get_var($wpdb->prepare($query_num_likes, $article_id));

      return ["status" => "success", "article_id" => $article_id, "num_likes" => (int)$num_likes];
    } else {
      return ["status" => "error"];
    }
  }

  /**
   * REST: remove like
   *
   * @param   array  $request  WP_REST_Request
   *
   * @return  array            result
   */
  public static function rest_likes_remove($request) {
    $json_params = $request->get_json_params();
    $query = $request->get_query_params();
    $article_id = (int)$json_params["article_id"];

    $user = wp_get_current_user();

    global $wpdb;

    // delete like
    $query_delete_like = $wpdb->delete("{$wpdb->prefix}likes", [
      "article_id" => $article_id,
      "user_id" => $user->ID,
    ], [
      "article_id" => "%d",
      "user_id" => "%d",
    ]);

    if ($query_delete_like) {
      $query_num_likes = "SELECT COUNT(like_id) FROM {$wpdb->prefix}likes WHERE article_id = '%d';";
      $num_likes = $wpdb->get_var($wpdb->prepare($query_num_likes, $article_id));

      return [
        "status" => "success",
        "article_id" => $article_id,
        "num_likes" => (int)$num_likes,
      ];
    } else {
      return ["status" => "error", "reason" => "no record found"];
    }
  }

  /**
   * REST: certificates
   *
   * @param   array  $request  WP_REST_Request
   *
   * @return  array            result
   */
  public static function rest_user_certificates($request) {
    $user = wp_get_current_user();
    $forbidden_categories = Helper::get_forbidden_learning_categories(false, true);

    global $wpdb;

    $sql = "
      SELECT
        ct.topic_id as term_id, ct.completed_date as completed_at, t.*, tt.*
      FROM
        {$wpdb->prefix}completed_topics ct
      LEFT JOIN
        {$wpdb->terms} t
      ON ct.topic_id = t.term_id
      LEFT JOIN
        {$wpdb->term_taxonomy} tt
      ON
        ct.topic_id = tt.term_id
      WHERE
        ct.user_id = {$user->ID}
        AND ct.topic_id IS NOT NULL
      ORDER BY
        ct.completed_date DESC
    ";

    $completed_topics = $wpdb->get_results($sql, OBJECT);

    // suppress wpml filters
    global $sitepress;
    remove_filter( 'get_terms_args', array( $sitepress, 'get_terms_args_filter' ) );
    remove_filter( 'get_term', array( $sitepress, 'get_term_adjust_id' ) );
    remove_filter( 'terms_clauses', array( $sitepress, 'terms_clauses' ) );

    foreach($completed_topics as &$topic) {
      $topic->fields = apply_filters("dp/filter_acf_fields", get_field_objects($topic), "dp-category", []);

      $sql = "
        SELECT
          *
        FROM
          {$wpdb->term_taxonomy} tt
        LEFT JOIN
          {$wpdb->terms} t
        ON
          tt.term_id = t.term_id
        WHERE
          tt.parent = {$topic->term_id}
          AND tt.count > 0
        " . (!empty($forbidden_categories) ? " AND tt.term_id NOT IN (" . join(",", $forbidden_categories) . ")" : "" ) . "
      ";

      $modules = $wpdb->get_results($sql, OBJECT);

      foreach($modules as &$module) {
        $module->fields = apply_filters("dp/filter_acf_fields", get_field_objects($module), "dp-category", []);
      }

      usort($modules, "\Simplicity\Helper::sort_by_order");

      $topic->modules = $modules;
    }

    // reactivate wpml filters
    add_filter( 'terms_clauses', array( $sitepress, 'terms_clauses' ), 10, 4 );
    add_filter( 'get_term', array( $sitepress, 'get_term_adjust_id' ), 1, 1 );
    add_filter( 'get_terms_args', array( $sitepress, 'get_terms_args_filter' ), 10, 2 );

    return [
      "status" => "success",
      "completed_topics" => $completed_topics,
    ];
  }

  /**
   * run migrations
   *
   * @return  array  status
   */
  public static function rest_migrations_run() {
    $resp = Plugin::detect_plugin_changes();
    do_action("dp/run_migration");

    return [
      "status" => $resp,
    ];
  }

  /**
   * remove single article
   *
   * @param   int     $article_id  article id
   * @param   int     $user_id     user id
   * @param   string  $lang        lang code
   *
   * @return  array                result
   */
  private static function remove_single_article($article_id, $user_id, $lang) {
    global $wpdb;

    // delete article
    $query_delete_article = $wpdb->delete("{$wpdb->prefix}bookmarks", [
      "article_id" => $article_id,
      "user_id" => $user_id,
      "lang" => $lang,
    ], [
      "article_id" => "%d",
      "user_id" => "%d",
      "lang" => "%s",
    ]);

    if ($query_delete_article) {
      return [
        "status" => "success",
        "article_id" => $article_id,
        "num_bookmarks" => self::get_number_of_bookmarks($user_id, $lang),
      ];
    } else {
      return ["status" => "error", "reason" => "no record found"];
    }
  }

  /**
   * remove all bookmarks
   *
   * @param   int     $user_id  user id
   * @param   string  $lang     lang code
   *
   * @return  array             result
   */
  private static function remove_all_bookmarks($user_id, $lang) {
    global $wpdb;

    // get bookmarks
    $bookmarks = $wpdb->get_col(
      $wpdb->prepare("SELECT article_id FROM {$wpdb->prefix}bookmarks WHERE user_id = '%d' AND lang = '%s';", $user_id, $lang)
    );

    $query = $wpdb->delete("{$wpdb->prefix}bookmarks", [
      "user_id" => $user_id,
      "lang" => $lang,
    ], [
      "user_id" => "%d",
      "lang" => "%s",
    ]);

    if ($query) {
      return [
        "status" => "success",
        "article_ids" => $bookmarks,
        "num_bookmarks" => 0,
      ];
    } else {
      return [
        "status" => "error",
        "reason" => "bookmarks could not be deleted",
      ];
    }
  }

  /**
   * get number of bookmarks
   *
   * @param   int     $user_id  user id
   * @param   string  $lang     lang code
   *
   * @return  int               number of bookmarks
   */
  private static function get_number_of_bookmarks($user_id, $lang) {
    global $wpdb;

    $query_num_bookmarks = "SELECT COUNT(bookmark_id) FROM {$wpdb->prefix}bookmarks WHERE user_id = '%d' AND lang = '%s';";
    $num_bookmarks = $wpdb->get_var($wpdb->prepare($query_num_bookmarks, $user_id, $lang));

    return $num_bookmarks;
  }
}

<?php

namespace Simplicity\Knowledge;

use Simplicity\Helper;

final class REST {
  public static function init() {
    add_action("rest_api_init", __CLASS__ . "::register_rest_routes");

    add_filter("dp/search_args", __CLASS__ . "::search_args", 10);
    add_filter("dp/search_result/knowledge", __CLASS__ . "::search_result", 10, 2);
  }

  public static function register_rest_routes() {
    // dp/v1/knowledge/categories
    register_rest_route("dp/v1", "/knowledge/categories", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_knowledge_categories",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/knowledge/category/:id
    register_rest_route("dp/v1", "/knowledge/category/(?P<id>\d+)", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_subcategories_by_category",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/knowledge/articles
    register_rest_route("dp/v1", "/knowledge/articles", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_knowledge_articles_by_category_or_subcategory",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/knowledge/articles/:id
    register_rest_route("dp/v1", "/knowledge/articles/(?P<id>\d+)", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_knowledge_articles_by_category_or_subcategory",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/knowledge/article/:id
    register_rest_route("dp/v1", "/knowledge/article/(?P<id>\d+)", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_knowledge_article_by_id",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/knowledge/latest
    register_rest_route("dp/v1", "/knowledge/latest", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_knowledge_latest_articles",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/knowledge/categories_and_subcategories
    register_rest_route("dp/v1", "/knowledge/categories_and_subcategories", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_categories_and_subcategories",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/knowledge/comments/:id
    register_rest_route("dp/v1", "/knowledge/comments/(?P<id>\d+)", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_knowledge_comments",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/knowledge/add_comment/:id
    register_rest_route("dp/v1", "/knowledge/add_comment/(?P<id>\d+)", [
      "methods" => "POST",
      "callback" => __CLASS__ . "::rest_knowledge_add_comment",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/knowledge/tags
    register_rest_route("dp/v1", "/knowledge/tags", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_knowledge_tags",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);
  }

  /**
   * REST: get knowledge categories
   *
   * @return     array  knowledge categories
   */
  public static function rest_knowledge_categories() {
    $forbidden_categories = Helper::get_forbidden_knowledge_categories();
    $categories = get_terms("knowledge_category", [
      "hide_empty" => true,
      "parent" => 0,
      "exclude" => $forbidden_categories,
    ]);
    $result = [];

    foreach ($categories as $category) {
      $category->fields = apply_filters("dp/filter_acf_fields", get_field_objects($category), "dp-category", ["linked_knowledge_articles"]);
      $result[] = $category;
      $article_count = 0;

      // add first subcategory of category
      $subcategories = get_terms("knowledge_category", [
        "hide_empty" => true,
        "parent" => $category->term_id,
        "exclude" => $forbidden_categories,
      ]);

      if (empty($subcategories)) {
        $category->first_subcategory = null;
        continue;
      }

      foreach ($subcategories as &$subcategory) {
        $subcategory->fields = apply_filters("dp/filter_acf_fields", get_field_objects($subcategory), "dp-category", ["linked_knowledge_articles"]);
        $article_count = $article_count + $subcategory->count;
      }

      usort($subcategories, "\Simplicity\Helper::sort_by_order");

      $category->first_subcategory = $subcategories[0];
      $category->number_articles = $article_count;
    }

    usort($result, "\Simplicity\Helper::sort_by_order");

    return $result;
  }

  /**
   * get subcategories by category
   * query vars: include_articles
   *
   * @param      array  $request  The request
   *
   * @return     array   Data
   */
  public static function rest_subcategories_by_category($request) {
    $id = intval($request["id"]);
    $query = $request->get_query_params();
    $forbidden_categories = Helper::get_forbidden_knowledge_categories();
    $parent = get_term($id, "knowledge_category");

    if (!$parent) {
      return new \WP_Error(
        "[dps] category does not exist",
        "the requested category does not exist",
        ["status" => 404]
      );
    }

    $parent->fields = apply_filters("dp/filter_acf_fields", get_field_objects($parent), "dp-category", []);

    // get translations for parent
    $parent->translations = Helper::get_taxonomy_translations($parent->term_id, "knowledge_category");

    // get subcategories
    $subcategories = get_terms("knowledge_category", [
      "parent" => $parent->term_id,
      "hide_empty" => (isset($query["hide_empty"]) ? filter_var($query["hide_empty"], FILTER_VALIDATE_BOOLEAN) : true),
      "exclude" => $forbidden_categories,
    ]);

    foreach ($subcategories as &$subcategory) {
      $subcategory->fields = apply_filters("dp/filter_acf_fields", get_field_objects($subcategory), "dp-category", ["linked_knowledge_articles"]);

      // reading time of all articles in the subcategory
      $reading_times = [];

      $post_ids = get_posts([
        "post_type" => "knowledge",
        "numberposts" => -1,
        "fields" => "ids",
        "tax_query" => [
          [
            "taxonomy" => "knowledge_category",
            "field" => "term_id",
            "terms" => $subcategory->term_id,
          ],
        ],
      ]);

      foreach ($post_ids as $post_id) {
        $reading_times[] = get_field("reading_time", $post_id);
      }

      $subcategory->fields->reading_time = array_sum($reading_times);

      // articles
      if(isset($query["include_articles"])) {
        $subcategory->articles = [];
        $articles = get_posts(["post_type" => "knowledge", "post__in" => $post_ids]);

        foreach($articles as $article) {
          $subcategory->articles[] = [
            "ID" => $article->ID,
            "post_title" => $article->post_title,
            "post_name" => $article->post_name,
            "fields" => apply_filters("dp/filter_acf_fields", get_field_objects($article), "dp-article", ["linked_knowledge_articles"]),
          ];
        }

        usort($subcategory->articles, "\Simplicity\Helper::sort_by_order");
      }
    }

    usort($subcategories, "\Simplicity\Helper::sort_by_order");

    return [
      "category" => $parent,
      "subcategories" => $subcategories,
    ];
  }

  /**
   * REST: get knowledge articles by category or subcategory
   * query vars: include_content
   *
   * @param      object  $request  WP_Request
   *
   * @return     array   Posts
   */
  public static function rest_knowledge_articles_by_category_or_subcategory($request) {
    $id = intval($request["id"]);
    $query = $request->get_query_params();
    $forbidden_categories = Helper::get_forbidden_knowledge_categories();
    $result = [];
    $is_category = false;
    $is_archive = false;

    // archive or article by category/subcategory
    if(!$id) {
      $category = $subcategory = new \stdClass();
      $is_archive = true;
    } else {
      $term = get_term($id, "knowledge_category");

      if (!$term) {
        return new \WP_Error(
          "[dps] subcategory does not exist",
          "the requested subcategory does not exist",
          ["status" => 404]
        );
      }

      // get fields for term
      $term->fields = apply_filters("dp/filter_acf_fields", get_field_objects($term), "dp-category", []);

      // get translations for term
      $term->translations = Helper::get_taxonomy_translations($term->term_id, "knowledge_category");

      // term is category
      if($term->parent === 0) {
        $category = $term;
        $subcategory = new \stdClass();
        $is_category = true;

        if (isset($category->fields->exclude_roles) && Helper::do_user_roles_match($category->fields->exclude_roles)) {
          return new \WP_Error(
            "[dps] access to category not granted",
            "you are not allowed to view this category",
            ["status" => 403]
          );
        }
      // term is subcategory
      } else {
        $subcategory = $term;
        $category = get_term($subcategory->parent, "knowledge_category");
        $category->fields = apply_filters("dp/filter_acf_fields", get_field_objects($category), "dp-category", []);

        if (
          (isset($subcategory->fields->exclude_roles) && Helper::do_user_roles_match($subcategory->fields->exclude_roles))
          ||
          (isset($category->fields->exclude_roles) && Helper::do_user_roles_match($category->fields->exclude_roles))
        ) {
          return new \WP_Error(
            "[dps] access to subcategory not granted",
            "you are not allowed to view this subcategory",
            ["status" => 403]
          );
        }
      }
    }

    // get articles
    $post_args = [
      "posts_per_page" => (isset($query["posts_per_page"]) ? absint($query["posts_per_page"]) : -1),
      "offset" => (isset($query["offset"]) ? absint($query["offset"]) : 0),
      "post_type" => "knowledge",
      "post_status" => "publish",
      "meta_query" => [
        "relation" => "AND",
        "views" => [
          "key" => "views",
          "type" => "NUMERIC",
        ],
        "order" => [
          "key" => "order",
          "type" => "NUMERIC",
        ],
        "reading_time" => [
          "key" => "reading_time",
          "type" => "NUMERIC",
        ]
      ],
    ];

    // tax query
    if($is_archive) {
      $terms = get_terms([
        "taxonomy" => "knowledge_category",
        "fields" => "ids",
        "hide_empty" => false,
        "child_of" => 0,
      ]);

      $post_args["tax_query"] = [
        [
          "taxonomy" => "knowledge_category",
          "field" => "term_id",
          "terms" => array_diff($terms, $forbidden_categories),
        ]
      ];
    } elseif($is_category) {
      $subcategories = get_terms([
        "taxonomy" => "knowledge_category",
        "parent" => $category->term_id,
        "fields" => "ids",
      ]);

      $post_args["tax_query"] = [
        [
          "taxonomy" => "knowledge_category",
          "field" => "term_id",
          "terms" => array_diff($subcategories, $forbidden_categories),
        ],
      ];
    } else {
      $post_args["tax_query"] = [
        [
          "taxonomy" => "knowledge_category",
          "field" => "term_id",
          "terms" => $subcategory->term_id,
        ],
      ];
    }

    if(isset($query["sortby"]) && isset($query["orderby"])) {
      $post_args["orderby"] = self::build_sort_array($query["sortby"], $query["orderby"], ["comment_count", "date", "modified", "views", "order", "reading_time"], "order", "ASC");
    }

    // add tags
    if (isset($query["tag"]) && !empty(trim($query["tag"]))) {
      $post_args["meta_query"][] = [
        "key" => "tag",
        "value" => $query["tag"],
      ];
    }

    // enable shortcodes if content should be included
    if(isset($query["include_content"])) {
      \WPBMap::addAllMappedShortcodes();
    }

    $knowledge_articles = new \WP_Query($post_args);

    foreach ($knowledge_articles->posts as $article) {
      // likes
      $likes = Helper::count_likes($article->ID);

      // result
      $res = [
        "ID" => $article->ID,
        "post_title" => $article->post_title,
        "post_excerpt" => $article->post_excerpt | "",
        "post_name" => $article->post_name,
        "post_date" => $article->post_date,
        "post_date_gmt" => $article->post_date_gmt,
        "post_modified" => $article->post_modified,
        "post_modified_gmt" => $article->post_modified_gmt,
        "post_thumbnail" => get_the_post_thumbnail_url($article, "dp-article"),
        "fields" => apply_filters("dp/filter_acf_fields", get_field_objects($article), "dp-article", ["linked_knowledge_articles"]),
        "comment_count" => intval(get_comments_number($article->ID)),
        "is_bookmarked" => Helper::is_article_bookmarked($article->ID),
        "num_likes" => $likes["num_likes"],
        "is_liked" => $likes["is_liked"],
      ];

      // add content if required
      if(isset($query["include_content"])) {
        $res["post_content"] = apply_filters("the_content", $article->post_content, $article->ID);
      }

      $result[] = $res;
    }

    return [
      "category" => $category,
      "subcategory" => $subcategory,
      "posts" => $result,
      "is_category" => $is_category,
      "is_archive" => $is_archive,
    ];
  }

  /**
   * REST: get single knowledge article by id
   *
   * @param      object  $request  WP_Request
   *
   * @return     object  The post
   */
  public static function rest_knowledge_article_by_id($request) {
    $id = intval($request["id"]);
    $query = $request->get_query_params();
    $has_permission = false;

    $post = get_post($id);

    if (!$post) {
      return new \WP_Error(
        "[dps] library article does not exist",
        "the requested article does not exist",
        ["status" => 404]
      );
    }

    // preview
    if(isset($query["preview"]) && current_user_can("edit_posts")) {
      if($revisions = wp_get_post_revisions($post->ID)) {
        $last_revision = reset($revisions);
        $rev = wp_get_post_revision($last_revision->ID);
        $post->post_content = $rev->post_content;
        $post->post_title = $rev->post_title;
      }

      $has_permission = true;
    }

    // if post status is not 'publish' and has no permissions
    if ($post->post_status !== "publish" && !$has_permission) {
      return new \WP_Error(
        "[dps] academy article does not exist",
        "the requested article does not exist",
        ["status" => 404]
      );
    }

    // subcategory
    $subcategory = get_the_terms($post->ID, "knowledge_category")[0];
    $subcategory->fields = apply_filters("dp/filter_acf_fields", get_field_objects($subcategory), "dp-category");
    $post->subcategory = $subcategory;

    // category
    $category = get_term($subcategory->parent, "knowledge_category");
    $category->fields = apply_filters("dp/filter_acf_fields", get_field_objects($category), "dp-category");
    $post->category = $category;

    if (
      (isset($subcategory->fields->exclude_roles) && Helper::do_user_roles_match($subcategory->fields->exclude_roles))
      ||
      (isset($category->fields->exclude_roles) && Helper::do_user_roles_match($category->fields->exclude_roles))
    ) {
      return new \WP_Error(
        "[dps] access to library article not granted",
        "you are not allowed to view this article",
        ["status" => 403]
      );
    }

    // enable shortcodes and apply content filters
    \WPBMap::addAllMappedShortcodes();
    $post->post_content = apply_filters("the_content", $post->post_content, $post->ID);

    // update views
    $views = get_field("views", $post->ID);

    if ($views == null) {
      $views = 0;
    } else {
      $views = intval($views);
    }

    $views++;
    update_field("views", $views, $post->ID);

    // attach fields
    $post->fields = apply_filters("dp/filter_acf_fields", get_field_objects($post), "dp-article");

    if(isset($post->fields->linked_learning_articles) && is_array($post->fields->linked_learning_articles)) {
      foreach ($post->fields->linked_knowledge_articles as &$linked_knowledge_article) {
        // subcategory for linked knowledge article
        $linked_subcategory = get_the_terms($linked_knowledge_article["ID"], "knowledge_category")[0];
        $linked_subcategory->fields = apply_filters("dp/filter_acf_fields", get_field_objects($linked_subcategory), "dp-category");

        // category for linked knowledge article
        $linked_category = get_term($linked_subcategory->parent, "knowledge_category");
        $linked_category->fields = apply_filters("dp/filter_acf_fields", get_field_objects($linked_category), "dp-category");

        $linked_knowledge_article["subcategory"] = $linked_subcategory;
        $linked_knowledge_article["category"] = $linked_category;
        $linked_knowledge_article["comment_count"] = intval(get_comments_number($linked_knowledge_article["ID"]));
      }
    } else {
      $post->fields->linked_learning_articles = [];
    }

    $post->next_post = self::get_adjacent_post($post, $subcategory, ">");
    $post->prev_post = self::get_adjacent_post($post, $subcategory, "<");

    // get post translations
    $post->translations = Helper::get_post_translations($post->ID, "knowledge");

    // is bookmarked?
    $post->is_bookmarked = Helper::is_article_bookmarked($post->ID);

    // likes
    $likes = Helper::count_likes($post->ID);
    $post->num_likes = $likes["num_likes"];
    $post->is_liked = $likes["is_liked"];

    return $post;
  }

  /**
   * build sort array for WP_Query
   *
   * @param   string  $sortby            key or meta_key
   * @param   string  $orderby           order by string
   * @param   array   $allowed_keys      allowed keys
   * @param   string  $default_sort_key  default meta_key
   * @param   string  $default_order     default order string (asc or desc)
   *
   * @return  array
   */
  private static function build_sort_array($sortby, $orderby, $allowed_keys = ["date"], $default_sort_key = "date", $default_order = "ASC") {
    if ($sortby === NULL || empty($sortby)) {
      $sortby = $default_sort_key;
    }

    if ($orderby === NULL || empty($orderby)) {
      $orderby = $default_order;
    }

    if (in_array($sortby, $allowed_keys)) {
      return [
        $sortby => $orderby,
      ];
    } else {
      return [
        $default_sort_key => $default_order,
      ];
    }
  }

  /**
   * Gets the adjacent post based upon custom field "order"
   *
   * @param      object  $post     The post
   * @param      object  $subcategory   The subcategory
   * @param      string  $compare  The compare
   *
   * @return     object  The adjacent post.
   */
  private static function get_adjacent_post($post, $subcategory, $compare = ">") {
    $adjacent_posts = get_posts([
      "post_type" => "knowledge",
      "meta_query" => [
        [
          "key" => "order",
          "compare" => $compare,
          "value" => $post->fields->order,
        ],
      ],
      "tax_query" => [
        [
          "taxonomy" => "knowledge_category",
          "field" => "term_id",
          "terms" => $subcategory->term_id,
        ],
      ],
    ]);

    foreach ($adjacent_posts as &$a_post) {
      $a_post->fields = apply_filters("dp/filter_acf_fields", get_field_objects($a_post), "dp-category", ["linked_knowledge_articles"]);
    }

    usort($adjacent_posts, "\Simplicity\Helper::sort_by_order");

    if ($compare == ">") {
      return isset($adjacent_posts[0]) ? $adjacent_posts[0] : null;
    } else {
      return count($adjacent_posts) > 0 ? array_pop($adjacent_posts) : null;
    }
  }

  /**
   * REST: latest knowledge articles
   * @param  array $request The request
   * @return array          latest knowledge
   */
  public static function rest_knowledge_latest_articles($request) {
    $query = $request->get_query_params();
    $posts_per_page = isset($query["posts_per_page"]) ? intval($query["posts_per_page"]) : 6;
    $forbidden_categories = Helper::get_forbidden_knowledge_categories();
    $result = [];

    $knowledge_articles = get_posts([
      "post_type" => "knowledge",
      "posts_per_page" => $posts_per_page,
      "post_status" => "publish",
      "suppress_filters" => false,
      "tax_query" => [
        [
          "taxonomy" => "knowledge_category",
          "field" => "term_id",
          "terms" => $forbidden_categories,
          "operator" => "NOT IN",
        ],
      ],
    ]);

    foreach ($knowledge_articles as $article) {
      // subcategory
      $subcategory = get_the_terms($article->ID, "knowledge_category")[0];
      $subcategory->fields = apply_filters("dp/filter_acf_fields", get_field_objects($subcategory), "dp-category", ["linked_knowledge_articles", "excluded_roles"]);

      // category
      $category = get_term($subcategory->parent, "knowledge_category");
      $category->fields = apply_filters("dp/filter_acf_fields", get_field_objects($category), "dp-category", ["linked_knowledge_articles", "excluded_roles"]);

      // likes
      $likes = Helper::count_likes($article->ID);

      $result[] = [
        "ID" => $article->ID,
        "post_title" => $article->post_title,
        "post_excerpt" => $article->post_excerpt | "",
        "post_name" => $article->post_name,
        "post_date" => $article->post_date,
        "post_date_gmt" => $article->post_date_gmt,
        "post_thumbnail" => get_the_post_thumbnail_url($article, "dp-article"),
        "subcategory" => $subcategory,
        "category" => $category,
        "fields" => apply_filters("dp/filter_acf_fields", get_field_objects($article->ID), "dp-article", ["linked_knowledge_articles"]),
        "comment_count" => intval(get_comments_number($article->ID)),
        "num_likes" => $likes["num_likes"],
        "is_liked" => $likes["is_liked"],
      ];
    }

    return $result;
  }

  /**
   * REST: categories and subcategories
   *
   * @return     array  Hierarchical categories (two levels - categories & subcategories)
   */
  public static function rest_categories_and_subcategories() {
    $forbidden_categories = Helper::get_forbidden_knowledge_categories();
    $categories = get_terms("knowledge_category", [
      "hide_empty" => true,
      "orderby" => "term_id",
      "parent" => 0,
      "exclude" => $forbidden_categories,
    ]);
    $result = [];

    foreach ($categories as $category) {
      $category->fields = apply_filters("dp/filter_acf_fields", get_field_objects($category), "dp-category", ["linked_knowledge_articles"]);

      $subcategories = get_terms("knowledge_category", [
        "hide_empty" => true,
        "orderby" => "term_id",
        "parent" => $category->term_id,
        "exclude" => $forbidden_categories,
      ]);

      if(count($subcategories) > 0) {
        $category->children = [];
        foreach($subcategories as $subcategory) {
          $subcategory->fields = apply_filters("dp/filter_acf_fields", get_field_objects($subcategory), "dp-category", ["linked_knowledge_articles"]);
          $category->children["id_{$subcategory->term_id}"] = $subcategory;
        }
      }

      $result["id_{$category->term_id}"] = $category;
    }

    usort($result, "\Simplicity\Helper::sort_by_order");
    foreach ($result as &$category) {
      if (count($category->children) > 0) {
        usort($category->children, "\Simplicity\Helper::sort_by_order");
      }
    }

    return $result;
  }

  /**
   * REST: Get comments of a knowledge article
   *
   * @param      WP_Request  $request  The request
   *
   * @return     array                 List of comments
   */
  public static function rest_knowledge_comments($request) {
    $id = intval($request["id"]);
    $query = $request->get_query_params();
    $comments_per_page = (isset($query["comments_per_page"]) ? absint($query["comments_per_page"]) : "");
    $offset = (isset($query["offset"]) ? absint($query["offset"]) : 0);

    $post = get_post($id);

    if (!$post || $post->post_status !== "publish" || $post->post_type !== "knowledge") {
      return new \WP_Error(
        "[dps] library article does not exist",
        "the requested article does not exist",
        ["status" => 404]
      );
    }

    // subcategory
    $subcategory = get_the_terms($post->ID, "knowledge_category")[0];
    $subcategory->fields = apply_filters("dp/filter_acf_fields", get_field_objects($subcategory), "dp-category");
    $post->subcategory = $subcategory;

    // category
    $category = get_term($subcategory->parent, "knowledge_category");
    $category->fields = apply_filters("dp/filter_acf_fields", get_field_objects($category), "dp-category");
    $post->category = $category;

    // check if allowed to comment
    if (
      (isset($subcategory->fields->exclude_roles) && Helper::do_user_roles_match($subcategory->fields->exclude_roles))
      ||
      (isset($category->fields->exclude_roles) && Helper::do_user_roles_match($category->fields->exclude_roles))
    ) {
      return new \WP_Error(
        "[dps] access to knowledge article not granted",
        "you are not allowed to comment this article",
        ["status" => 403]
      );
    }

    // get comments incl. unapproved comments
    $comments = get_comments([
      "post_id" => $post->ID,
      "order" => "ASC",
      "number" => $comments_per_page,
      "offset" => $offset,
    ]);

    // add user display name and avatar to comment
    foreach ($comments as &$comment) {
      $user = get_userdata($comment->user_id);
      $comment->comment_author = $user->display_name;
      $comment->comment_content = nl2br($comment->comment_content);
      if (function_exists("has_wp_user_avatar")) {
        $comment->user_avatar = has_wp_user_avatar($comment->user_id) ? get_wp_user_avatar_src($comment->user_id, 96) : get_avatar_url($comment->user_id);
      } else {
        $comment->user_avatar = get_avatar_url($comment->user_id);
      }
    }

    return [
      "comments" => $comments,
      "total_comments" => intval(get_comments_number($post->ID)),
    ];
  }

  /**
   * REST: Post a comment to a knowledge article
   *
   * @param      WP_Request      $request  The request
   *
   * @return     WP_Error|object           error|comment object
   */
  public static function rest_knowledge_add_comment($request) {
    $url_params = $request->get_url_params();
    $json_params = $request->get_json_params();

    $id = intval($url_params["id"]);
    $comment_content = $json_params["comment_content"];

    $post = get_post($id);

    if (!$post || $post->post_status !== "publish" || $post->post_type !== "knowledge") {
      return new \WP_Error(
        "[dps] library article does not exist",
        "the requested article does not exist",
        ["status" => 404]
      );
    }

    // subcategory
    $subcategory = get_the_terms($post->ID, "knowledge_category")[0];
    $subcategory->fields = apply_filters("dp/filter_acf_fields", get_field_objects($subcategory), "dp-category");
    $post->subcategory = $subcategory;

    // category
    $category = get_term($subcategory->parent, "knowledge_category");
    $category->fields = apply_filters("dp/filter_acf_fields", get_field_objects($category), "dp-category");
    $post->category = $category;

    // check if allowed to comment
    if (
      (isset($subcategory->fields->exclude_roles) && Helper::do_user_roles_match($subcategory->fields->exclude_roles))
      ||
      (isset($category->fields->exclude_roles) && Helper::do_user_roles_match($category->fields->exclude_roles))
    ) {
      return new \WP_Error(
        "[dps] access to library article not granted",
        "you are not allowed to comment this article",
        ["status" => 403]
      );
    }

    // get current user
    $current_user = get_userdata(get_current_user_id());

    // the comment data
    $comment = [
      "comment_post_ID" => $post->ID,
      "comment_parent" => 0, // no hierarchy
      "comment_content" => $comment_content,
      "comment_type" => "",
      "user_id" => $current_user->ID,
    ];

    // insert comment
    $new_comment_ID = wp_new_comment($comment, true);

    if (is_wp_error($new_comment_ID)) {
      return new \WP_Error(
        "[dps] {$new_comment_ID->get_error_code()}",
        $new_comment_ID->get_error_message(),
        ["status" => 403]
      );
    } else {
      return [
        "comment" => get_comment($new_comment_ID),
      ];
    }
  }

  /**
   * REST: Get tags of knowledge
   *
   * @return     array  List of tags
   */
  public static function rest_knowledge_tags() {
    return Helper::get_knowledge_tags();
  }

  /**
   * Search arguments
   *
   * @param   array  $args  search args
   *
   * @return  array         extended search args
   */
  public static function search_args($args) {
    // add post type
    array_push($args["post_type"], "knowledge");

    // exclude forbidden categories
    $forbidden_categories = Helper::get_forbidden_knowledge_categories();

    array_push($args["tax_query"], [
      "taxonomy" => "knowledge_category",
      "field" => "term_id",
      "terms" => $forbidden_categories,
      "operator" => "NOT IN",
    ]);

    return $args;
  }

  /**
   * Filter: Single search result
   *
   * @param   array   $result  Search result
   * @param   object  $post    WP_Post
   *
   * @return  array            Search result
   */
  public static function search_result($result, $post) {
    // subcategory
    $subcategory = get_the_terms($post->ID, "knowledge_category")[0];
    $subcategory->fields = apply_filters("dp/filter_acf_fields", get_field_objects($subcategory), "dp-category", ["linked_knowledge_articles"]);

    // category
    $category = get_term($subcategory->parent, "knowledge_category");
    $category->fields = apply_filters("dp/filter_acf_fields", get_field_objects($category), "dp-category", ["linked_knowledge_articles"]);

    $result["category"] = $category;
    $result["subcategory"] = $subcategory;

    // fields
    $result["fields"] = apply_filters("dp/filter_acf_fields", get_field_objects($post), "dp-article", ["linked_knowledge_articles"]);

    return $result;
  }
}

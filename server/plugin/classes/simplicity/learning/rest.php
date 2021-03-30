<?php

namespace Simplicity\Learning;

use Simplicity\Helper;
use Simplicity\Quiz\Base as Quiz;
use Simplicity\Video\Base as Video;

final class REST {
  public static function init() {
    add_action("rest_api_init", __CLASS__ . "::register_rest_routes");

    add_filter("dp/search_others_args", __CLASS__ . "::search_args", 10);
  }

  public static function register_rest_routes() {
    // dp/v1/learning/topics
    register_rest_route("dp/v1", "/learning/topics", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_learning_topics",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/learning/topic/:id
    register_rest_route("dp/v1", "/learning/topic/(?P<id>\d+)", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_modules_by_topic",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/learning/articles/:id
    register_rest_route("dp/v1", "/learning/articles/(?P<id>\d+)", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_learning_articles_by_module",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/learning/article/:id
    register_rest_route("dp/v1", "/learning/article/(?P<id>\d+)", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_learning_article_by_id",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/learning/latest
    register_rest_route("dp/v1", "/learning/latest", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_learning_latest_articles",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/learning/topics_and_modules
    register_rest_route("dp/v1", "/learning/topics_and_modules", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_topics_and_modules",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/learning/tags
    register_rest_route("dp/v1", "/learning/tags", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_learning_tags",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/learning/mark_as_read/:id
    register_rest_route("dp/v1", "/learning/mark_as_read/(?P<id>\d+)", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_learning_mark_as_read",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/learning/user-progress
    register_rest_route("dp/v1", "/learning/user-progress", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_learning_user_progress",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);
  }

  /**
   * REST: get topics
   *
   * @return  array Topics
   */
  public static function rest_learning_topics() {
    global $wpdb;

    $forbidden_categories = Helper::get_forbidden_learning_categories();
    $topics = get_terms("learning_topic", [
      "hide_empty" => true,
      "parent" => 0,
      "exclude" => $forbidden_categories,
    ]);
    $user = wp_get_current_user();
    $result = [];
    $completed_topics = [];

    // get completed topics by user
    $completed_topics_q = $wpdb->get_results("SELECT topic_id, completed_date as completed_at FROM {$wpdb->prefix}completed_topics WHERE user_id = {$user->ID} GROUP BY topic_id");

    foreach($completed_topics_q as $ct) {
      $completed_topics[$ct->topic_id] = $ct->completed_at;
    }

    foreach ($topics as $topic) {
      $topic->fields = apply_filters("dp/filter_acf_fields", get_field_objects($topic), "dp-category", []);
      $article_count = ["total" => 0, "modules" => []];
      $read_articles = 0;
      $read_articles_count_rp = 0;
      $incomplete_modules = [];

      // get modules
      $modules = get_terms("learning_topic", [
        "hide_empty" => true,
        "parent" => $topic->term_id,
        "exclude" => $forbidden_categories,
      ]);

      $module_ids = [];

      foreach($modules as &$module) {
        $module_ids[] = $module->term_id;
        $article_count["modules"][$module->term_id] = $module->count;
        $article_count["total"] = $article_count["total"] + $module->count;

        // add fields to module
        $module->fields = apply_filters("dp/filter_acf_fields", get_field_objects($module), "dp-category", []);
      }

      // sort and assign modules to topic
      usort($modules, "\Simplicity\Helper::sort_by_order");
      $topic->modules = $modules;

      // completed modules
      $completed_modules = array_merge([], ...$wpdb->get_results("SELECT module_id FROM {$wpdb->prefix}completed_modules WHERE user_id = " . \get_current_user_id() . (!empty($module_ids) ? " AND module_id IN (" . join(",", $module_ids) . ") " : "" ) . " GROUP BY module_id", ARRAY_N));
      $completed_modules_count = count($completed_modules);

      // only show topic if there are articles
      if($article_count["total"] != 0) {
        $topic->number_articles = $article_count["total"];
        $topic->number_modules = count($modules);
        $topic->completed_modules = ($completed_modules_count > $topic->number_modules ? $topic->number_modules : $completed_modules_count);

        // count articles by completed modules
        foreach($article_count["modules"] as $m => $c) {
          if(in_array((string)$m, $completed_modules)) {
            $read_articles += $c;
          } else {
            $incomplete_modules[] = (int)$m;
          }
        }

        // count read articles by incomplete modules
        if(count($incomplete_modules) > 0) {
          $read_articles_count_rp = (int)$wpdb->get_var(
            $wpdb->prepare(
              "SELECT COUNT(article_id)
              FROM {$wpdb->prefix}reading_progress as rp
              LEFT JOIN {$wpdb->posts} as p
              ON rp.article_id = p.ID
              WHERE rp.module_id IN (" . join(",", $incomplete_modules) . ") AND rp.user_id = %d AND rp.article_id IS NOT NULL AND p.post_status = 'publish'",
              get_current_user_id()
            )
          );
        }

        $topic->read_articles = $read_articles + $read_articles_count_rp;

        // check if topic is completed
        $topic->completed_at = (isset($completed_topics[$topic->term_id])) ? $completed_topics[$topic->term_id] : false;

        $result[] = $topic;
      }
    }

    usort($result, "\Simplicity\Helper::sort_by_order");

    return $result;
  }

  /**
   * REST: get modules by topic
   * query vars: include_content
   *
   * @param   object  $request  WP_Request
   *
   * @return  array   Modules
   */
  public static function rest_modules_by_topic($request) {
    global $wpdb;

    $id = intval($request["id"]);
    $query = $request->get_query_params();
    $forbidden_categories = Helper::get_forbidden_learning_categories();
    $parent = get_term($id, "learning_topic");
    $user_id = get_current_user_id();

    if (!$parent) {
      return new \WP_Error(
        "[dps] topic does not exist",
        "the requests topic does not exist",
        ["status" => 404]
      );
    }

    $parent->fields = apply_filters("dp/filter_acf_fields", get_field_objects($parent), "dp-category");

    // get translations for parent
    $parent->translations = Helper::get_taxonomy_translations($parent->term_id, "learning_topic");

    // prev and next topic
    $parent->next_topic = self::get_adjacent_topic($parent, ">");
    $parent->prev_topic = self::get_adjacent_topic($parent, "<");

    // modules
    $modules = get_terms("learning_topic", [
      "parent" => $parent->term_id,
      "hide_empty" => (isset($query["hide_empty"]) ? filter_var($query["hide_empty"], FILTER_VALIDATE_BOOLEAN) : true),
      "exclude" => $forbidden_categories,
    ]);

    // enable shortcodes if content should be included
    if(isset($query["include_content"])) {
      \WPBMap::addAllMappedShortcodes();
    }

    $completed_modules = self::get_completed_modules($user_id);

    foreach ($modules as &$module) {
      $module->fields = apply_filters("dp/filter_acf_fields", get_field_objects($module), "dp-category", ["read_in_order"]);

      // module has new articles
      $module_has_new_articles = false;

      // reading time of all articles in the module
      $reading_times = [];

      // prepare articles
      $articles = get_posts([
        "post_type" => "learning",
        "post_status" => "publish",
        "numberposts" => -1,
        "tax_query" => [
          [
            "taxonomy" => "learning_topic",
            "field" => "term_id",
            "terms" => $module->term_id,
          ],
        ],
        "meta_query" => [
          "relation" => "AND",
          "order" => [
            "key" => "order",
            "type" => "NUMERIC",
          ]
        ],
        "orderby" => [
          "order" => "ASC"
        ]
      ]);

      // get read articles
      $read_articles = $wpdb->get_col(
        $wpdb->prepare(
          "SELECT article_id
          FROM {$wpdb->prefix}reading_progress as rp
          LEFT JOIN {$wpdb->posts} as p
          ON rp.article_id = p.ID
          WHERE rp.module_id = %d AND rp.user_id = %d AND rp.article_id IS NOT NULL AND p.post_status = 'publish'",
          $module->term_id,
          $user_id
        )
      );

      foreach ($articles as &$article) {
        $article->fields = apply_filters("dp/filter_acf_fields", get_field_objects($article), "dp-category", ["linked_learning_articles"]);

        // add article reading time to module reading time collection
        $reading_times[] = intval($article->fields->reading_time);

        // check if article is already read
        $article->is_read = in_array($article->ID, $read_articles);

        // check if article is new
        if(!$article->is_read && isset($completed_modules[$module->term_id]) && strtotime($article->post_date) > $completed_modules[$module->term_id]) {
          $article->is_new = true;
          $module_has_new_articles = true;
        } else {
          $article->is_new = false;
        }

        // check if article is video
        $article->is_video = isset($article->fields->article_type) && $article->fields->article_type === "video";
        if($article->is_video) {
          $article->fields->video_url = Video::get($article->fields->video_id);
        }

        // check if article is quiz
        $article->is_quiz = isset($article->fields->article_type) && $article->fields->article_type === "quiz";
      }

      // map articles
      $module->articles = array_map(function($article) use ($query) {
        $result = [
          "ID" => $article->ID,
          "post_name" => $article->post_name,
          "post_title" => $article->post_title,
          "post_excerpt" => $article->post_excerpt,
          "fields" => $article->fields,
          "is_read" => $article->is_read,
          "is_bookmarked" => Helper::is_article_bookmarked($article->ID),
          "is_new" => $article->is_new,
          "is_video" => $article->is_video,
          "is_quiz" => $article->is_quiz,
        ];

        // add content if required
        if(isset($query["include_content"])) {
          $result["post_content"] = apply_filters("the_content", $article->post_content, $article->ID);
        }

        return $result;
      }, $articles);

      $module->fields->reading_time = array_sum($reading_times);
      $module->number_articles = count($articles);

      // read articles
      $module->read_articles = isset($completed_modules[$module->term_id]) ? $module->number_articles : count($read_articles);
      $module->is_read = ($module->read_articles >= $module->number_articles || isset($completed_modules[$module->term_id]));
      $module->is_available = self::check_if_module_is_available($module);
      $module->is_new = $module_has_new_articles;
      $module->is_final_quiz = false;
      $module->is_standalone_video = $module->number_articles === 1 && end($module->articles)["is_video"];
    }

    usort($modules, "\Simplicity\Helper::sort_by_order");

    // check if topic is completed
    $completed_topic = $wpdb->get_var("SELECT completed_date FROM {$wpdb->prefix}completed_topics WHERE user_id = {$user_id} AND topic_id = {$parent->term_id} GROUP BY topic_id");

    $parent->completed_at = $completed_topic ? $completed_topic : false;

    // check if last module is final quiz
    if(count($modules) > 0) {
      $m = end($modules);

      if(count($m->articles) === 1) {
        $a = end($m->articles);

        if(isset($a["fields"]->article_type) && $a["fields"]->article_type === "quiz") {
          $m->is_final_quiz = true;
        }
      }
    }

    return [
      "topic" => $parent,
      "modules" => $modules,
    ];
  }

  /**
   * REST: get single learning article by id
   *
   * @param      object  $request  WP_Request
   *
   * @return     object  The post
   */
  public static function rest_learning_article_by_id($request) {
    $id = strtolower($request["id"]);
    $query = $request->get_query_params();
    $has_permission = false;

    $post = get_post($id, [
      "post_status" => ["publish", "draft"]
    ]);

    if (!$post) {
      return new \WP_Error(
        "[dps] academy article does not exist",
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

    // module
    $module = get_the_terms($post->ID, "learning_topic")[0];
    $module->fields = apply_filters("dp/filter_acf_fields", get_field_objects($module), "dp-category");
    $post->module = $module;

    // topic
    $topic = get_term($module->parent, "learning_topic");
    $topic->fields = apply_filters("dp/filter_acf_fields", get_field_objects($topic), "dp-category");
    $post->topic = $topic;

    // check if user has access to article
    if (
      (isset($module->fields->exclude_roles) && Helper::do_user_roles_match($module->fields->exclude_roles))
      ||
      (isset($topic->fields->exclude_roles) && Helper::do_user_roles_match($topic->fields->exclude_roles))
    ) {
      return new \WP_Error(
        "[dps] access to academy article not granted",
        "you are not allowed to view this article",
        ["status" => 403]
      );
    }

    // check if topic modules have to be read in order
    // and previous module has not been read in total
    if($topic->fields->read_in_order) {
      if(!self::check_if_module_is_available($module) && !$has_permission) {
        $prevModule = self::get_adjacent_module($module, "<");

        return new \WP_Error(
          "[dps] academy article is not available yet",
          "you have to complete the previous module before you can read this article",
          [
            "status" => 404,
            "prevModule" => $prevModule,
            "topic" => $topic,
          ]
        );
      }
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

    if(is_array($post->fields->linked_learning_articles)) {
      foreach ($post->fields->linked_learning_articles as &$linked_learning_article) {
        // module for linked learning article
        $linked_module = get_the_terms($linked_learning_article["ID"], "learning_topic")[0];
        $linked_module->fields = apply_filters("dp/filter_acf_fields", get_field_objects($linked_module), "dp-category");

        // topic for linked learning article
        $linked_topic = get_term($linked_module->parent, "learning_topic");
        $linked_topic->fields = apply_filters("dp/filter_acf_fields", get_field_objects($linked_topic), "dp-category");

        $linked_learning_article["module"] = $linked_module;
        $linked_learning_article["topic"] = $linked_topic;
        $linked_learning_article["comment_count"] = intval(get_comments_number($linked_learning_article["ID"]));
      }
    } else {
      $post->fields->linked_learning_articles = [];
    }

    // quiz
    if(isset($post->fields->article_type) && $post->fields->article_type === "quiz") {
      $post->fields->is_quiz = true;

      $quiz = Quiz::get($post->fields->quiz_id);

      if(!empty($quiz)) {
        $post->quiz = $quiz;
      }
    }

    // video
    if(isset($post->fields->article_type) && $post->fields->article_type === "video") {
      $post->fields->is_video = true;
      $post->fields->video_url = Video::get($post->fields->video_id);
    }

    $post->next_post = self::get_adjacent_post($post, $module, ">");
    $post->prev_post = self::get_adjacent_post($post, $module, "<");

    // all articles
    $all_articles = get_posts([
      "post_type" => "learning",
      "post_status" => "publish",
      "numberposts" => -1,
      "fields" => ["ids"],
      "tax_query" => [
        [
          "taxonomy" => "learning_topic",
          "field" => "term_id",
          "terms" => $module->term_id,
        ]
      ],
      "meta_query" => [
        "relation" => "AND",
        "order" => [
          "key" => "order",
          "type" => "NUMERIC",
        ],
      ],
      "orderby" => [
        "order" => "ASC",
      ],
    ]);

    $post->all_articles = array_map(function($article) use ($post) {
      $article->fields = apply_filters("dp/filter_acf_fields", get_field_objects($article), "dp-category", ["linked_learning_articles"]);

      return [
        "ID" => $article->ID,
        "post_name" => $article->post_name,
        "post_title" => $article->post_title,
        "post_excerpt" => $article->post_excerpt,
        "fields" => $article->fields,
        "current_article" => ($article->ID == $post->ID)
      ];
    }, $all_articles);

    // get post translations
    $post->translations = Helper::get_post_translations($post->ID, "learning");

    // is bookmarked?
    $post->is_bookmarked = Helper::is_article_bookmarked($post->ID);

    return $post;
  }

  /**
   * REST: get learning articles by topic
   * query vars: include_content
   *
   * @param      object  $request  WP_Request
   *
   * @return     array   Posts
   */
  public static function rest_learning_articles_by_module($request) {
    $id = intval($request["id"]);
    $query = $request->get_query_params();
    $forbidden_categories = Helper::get_forbidden_learning_categories();
    $result = [];

    $module = get_term($id, "learning_topic");

    if (!$module) {
      return new \WP_Error(
        "[dps] module does not exist",
        "the requested module does not exist",
        ["status" => 404]
      );
    }

    $module->fields = apply_filters("dp/filter_acf_fields", get_field_objects($module), "dp-category");

    // topic
    $topic = get_term($module->parent, "learning_topic");
    $topic->fields = apply_filters("dp/filter_acf_fields", get_field_objects($topic), "dp-category");

    if (
      (isset($module->fields->exclude_roles) && Helper::do_user_roles_match($module->fields->exclude_roles))
      ||
      (isset($topic->fields->exclude_roles) && Helper::do_user_roles_match($topic->fields->exclude_roles))
    ) {
      return new \WP_Error(
        "[dps] access to module not granted",
        "you are not allowed to view this module",
        ["status" => 403]
      );
    }

    // get translations for module
    $module->translations = Helper::get_taxonomy_translations($module->term_id, "learning_topic");

    // get articles
    $post_args = [
      "posts_per_page" => (isset($query["posts_per_page"]) ? absint($query["posts_per_page"]) : -1),
      "offset" => (isset($query["offset"]) ? absint($query["offset"]) : 0),
      "post_type" => "learning",
      "tax_query" => [
        [
          "taxonomy" => "learning_topic",
          "field" => "term_id",
          "terms" => $module->term_id,
        ],
      ],
      "meta_query" => [],
    ];

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

    $learning_articles = get_posts($post_args);

    foreach ($learning_articles as $article) {
      $res = [
        "ID" => $article->ID,
        "post_title" => $article->post_title,
        "post_excerpt" => $article->post_excerpt | "",
        "post_name" => $article->post_name,
        "post_date" => $article->post_date,
        "post_date_gmt" => $article->post_date_gmt,
        "fields" => apply_filters("dp/filter_acf_fields", get_field_objects($article), "dp-article", ["linked_learning_articles"]),
        "comment_count" => intval(get_comments_number($article->ID)),
        "is_bookmarked" => Helper::is_article_bookmarked($article->ID),
      ];

      // add content if required
      if(isset($query["include_content"])) {
        $res["post_content"] = apply_filters("the_content", $article->post_content, $article->ID);
      }

      $result[] = $res;
    }

    usort($result, "\Simplicity\Helper::sort_by_order");

    return [
      "topic" => $topic,
      "module" => $module,
      "posts" => $result,
    ];
  }

  /**
   * REST: latest learning articles
   * @param  array $request The request
   * @return array          latest learning articles
   */
  public static function rest_learning_latest_articles($request) {
    $query = $request->get_query_params();
    $posts_per_page = isset($query["posts_per_page"]) ? intval($query["posts_per_page"]) : 6;
    $forbidden_categories = Helper::get_forbidden_learning_categories();
    $result = [];

    $learning_articles = get_posts([
      "post_type" => "learning",
      "posts_per_page" => $posts_per_page,
      "post_status" => "publish",
      "suppress_filters" => false,
      "tax_query" => [
        [
          "taxonomy" => "learning_topic",
          "field" => "term_id",
          "terms" => $forbidden_categories,
          "operator" => "NOT IN",
        ],
      ],
    ]);

    foreach ($learning_articles as $article) {
      // module
      $module = get_the_terms($article->ID, "learning_topic")[0];
      $module->fields = apply_filters("dp/filter_acf_fields", get_field_objects($module), "dp-category", ["excluded_roles"]);

      // topic
      $topic = get_term($module->parent, "learning_topic");
      $topic->fields = apply_filters("dp/filter_acf_fields", get_field_objects($topic), "dp-category", ["excluded_roles"]);

      $result[] = [
        "ID" => $article->ID,
        "post_title" => $article->post_title,
        "post_excerpt" => $article->post_excerpt | "",
        "post_name" => $article->post_name,
        "post_date" => $article->post_date,
        "post_date_gmt" => $article->post_date_gmt,
        "post_thumbnail" => get_the_post_thumbnail_url($article, "dp-article"),
        "module" => $module,
        "topic" => $topic,
        "fields" => apply_filters("dp/filter_acf_fields", get_field_objects($article->ID), "dp-article", ["linked_learning_articles"]),
        "comment_count" => intval(get_comments_number($article->ID)),
        "is_bookmarked" => Helper::is_article_bookmarked($article->ID),
      ];
    }

    return $result;
  }

  /**
   * REST: topics and modules
   *
   * @return     array  Hierarchical categories (two levels - topics & modules)
   */
  public static function rest_topics_and_modules() {
    $forbidden_categories = Helper::get_forbidden_learning_categories();
    $topics = get_terms("learning_topic", [
      "hide_empty" => true,
      "orderby" => "term_id",
      "parent" => 0,
      "exclude" => $forbidden_categories,
    ]);
    $result = [];

    foreach ($topics as $topic) {
      $topic->fields = apply_filters("dp/filter_acf_fields", get_field_objects($topic), "dp-category");

      $modules = get_terms("learning_topic", [
        "hide_empty" => true,
        "orderby" => "term_id",
        "parent" => $topic->term_id,
        "exclude" => $forbidden_categories,
      ]);

      if(count($modules) > 0) {
        $topic->children = [];
        foreach($modules as $module) {
          $module->fields = apply_filters("dp/filter_acf_fields", get_field_objects($module), "dp-category", ["linked_knowledge_articles"]);
          $topic->children["id_{$module->term_id}"] = $module;
        }
      }
    }

    usort($result, "\Simplicity\Helper::sort_by_order");
    foreach ($result as &$topic) {
      if (count($topic->children) > 0) {
        usort($topic->children, "\Simplicity\Helper::sort_by_order");
      }
    }

    return $result;
  }

  /**
   * REST: Get tags of learning
   *
   * @return     array  List of tags
   */
  public static function rest_learning_tags() {
    return Helper::get_learning_tags();
  }

  /**
   * REST: Mark article as read
   */
  public static function rest_learning_mark_as_read($request) {
    $id = $request["id"];
    $article = get_post($id);
    $forbidden_categories = Helper::get_forbidden_learning_categories();

    if($article === NULL || $article->post_type !== "learning" || $article->post_status !== "publish") {
      return new \WP_Error(
        "[dps] article does not exist",
        "the requested article does not exist",
        ["status" => 404]
      );
    }

    // module
    $module = get_the_terms($article->ID, "learning_topic")[0];
    $module->fields = apply_filters("dp/filter_acf_fields", get_field_objects($module), "dp-category", []);

    // topic
    $topic = get_term($module->parent, "learning_topic");
    $topic->fields = apply_filters("dp/filter_acf_fields", get_field_objects($topic), "dp-category", []);

    // check if user has access to module / topic
    if (
      (isset($module->fields->exclude_roles) && Helper::do_user_roles_match($module->fields->exclude_roles))
      ||
      (isset($topic->fields->exclude_roles) && Helper::do_user_roles_match($topic->fields->exclude_roles))
    ) {
      return new \WP_Error(
        "[dps] access to academy article not granted",
        "you are not allowed to view this article",
        ["status" => 403]
      );
    }

    // insert data
    $user_id = get_current_user_id();

    $data = [
      "module_id" => $module->term_id,
      "article_id" => $article->ID,
      "user_id" => $user_id,
      "read_date" => current_time("mysql"),
    ];

    global $wpdb;

    $results = $wpdb->get_results("SELECT read_id FROM {$wpdb->prefix}reading_progress WHERE article_id = {$data["article_id"]} AND user_id = {$data["user_id"]};", ARRAY_A);

    if(count($results) === 0) {
      $wpdb->insert("{$wpdb->prefix}reading_progress", $data, [
        "module_id" => "%d",
        "article_id" => "%d",
        "user_id" => "%d",
        "read_date" => "%s",
      ]);

      // maybe mark module as completed
      $completed_module = self::maybe_complete_module($module->term_id, $user_id);
      $completed_topic = self::maybe_complete_topic($module->parent, $user_id);
      $data = array_merge($data, [
        "completed_module" => $completed_module,
        "completed_topic" => $completed_topic
      ]);

      return array_merge($data, ["status" => "success"]);
    } else {
      return array_merge($results[0], ["status" => "dupe"]);
    }
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
    array_push($args["post_type"], "learning");

    // exclude forbidden categories
    $forbidden_categories = Helper::get_forbidden_learning_categories();

    array_push($args["tax_query"], [
      "taxonomy" => "learning_topic",
      "field" => "term_id",
      "terms" => $forbidden_categories,
      "operator" => "NOT IN",
    ]);

    return $args;
  }

  /**
   * REST: learning progress by current user
   *
   * @return  array  result
   */
  public static function rest_learning_user_progress() {
    global $wpdb;

    $result = [];

    // fetch modules in reading_progress with taxonomy data
    $read_modules = $wpdb->get_results(
      $wpdb->prepare(
        "SELECT
          t.*,
          cm.completed_id,
          t2.`name` AS topic_name,
          t2.`term_id` AS topic_id,
          t2.`slug` AS topic_slug,
          tt.count AS module_articles,
          tt.taxonomy,
          COUNT(DISTINCT rp.article_id) AS read_articles
        FROM
          {$wpdb->prefix}reading_progress AS rp
        INNER JOIN
          {$wpdb->terms} AS t ON rp.module_id = t.term_id
        INNER JOIN
          {$wpdb->term_taxonomy} AS tt ON tt.term_id = t.term_id
        INNER JOIN
          {$wpdb->terms} AS t2 ON t2.term_id = tt.parent
        LEFT JOIN
          {$wpdb->prefix}completed_modules AS cm ON cm.module_id = rp.module_id AND cm.user_id = rp.user_id
        INNER JOIN
          {$wpdb->posts} AS p ON rp.article_id = p.ID
        WHERE
          rp.user_id = %d
          AND cm.completed_id IS NULL
          AND rp.article_id IS NOT NULL
          AND p.post_status = 'publish'
        GROUP BY
          rp.module_id",
          \get_current_user_id()
      )
    );

    foreach($read_modules as $module) {
      // exclude completed modules
      if($module->module_articles === $module->read_articles) continue;

      // add fields
      $module->fields = apply_filters("dp/filter_acf_fields", get_field_objects($module), "dp-category");

      // add reading time per module
      $reading_times = [];

      $post_ids = get_posts([
        "post_type" => "learning",
        "post_status" => "publish",
        "numberposts" => -1,
        "tax_query" => [
          [
            "taxonomy" => "learning_topic",
            "field" => "term_id",
            "terms" => $module->term_id
          ]
        ],
        "fields" => "ids"
      ]);

      foreach($post_ids as $post_id) {
        $reading_times[] = intval(get_field("reading_time", $post_id));
      }

      $module->fields->reading_time = array_sum($reading_times);

      // add module to result
      $result[] = $module;
    }

    return ["status" => "success", "modules" => $result];
  }

  /**
   * get completed modules
   *
   * @param   int    $user_id  user id
   *
   * @return  array            completed modules or empty array
   */
  private static function get_completed_modules($user_id) {
    global $wpdb;

    $completed_modules = $wpdb->get_results(
      "
        SELECT
          module_id,
          completed_date
        FROM
          {$wpdb->prefix}completed_modules
        WHERE
          user_id = {$user_id};
      ",
      OBJECT
    );

    if(is_null($completed_modules)) {
      return [];
    } else {
      return array_reduce($completed_modules, function($acc, $m) {
        $acc[$m->module_id] = strtotime($m->completed_date);

        return $acc;
      }, []);
    }
  }

  /**
   * checks if module is available when parent topic has read_in_order set
   *
   * @param   object  $module  Module object
   *
   * @return  bool
   */
  private static function check_if_module_is_available($module) {
    $topic = get_term($module->parent);
    $topic->read_in_order = !!get_term_meta($topic->term_id, "read_in_order", true);

    // if topic can be read randomly, module is always available
    if(!$topic->read_in_order) {
      return true;
    }

    $adjacent_module = self::get_adjacent_module($module, "<");

    // if there is no previous module, no articles need to be checked.
    // so module is available for read
    if($adjacent_module === null) {
      return true;
    }

    global $wpdb;

    $user_id = get_current_user_id();

    $sql = "
      SELECT
        completed_id
      FROM
        {$wpdb->prefix}completed_modules
      WHERE
        module_id = {$adjacent_module->term_id}
        AND user_id = {$user_id};
    ";

    $completed_module = $wpdb->get_var($sql);

    return !is_null($completed_module);
  }

  /**
   * Gets the adjacent post based upon custom field "order"
   *
   * @param      object  $post     The post
   * @param      object  $module   The module
   * @param      string  $compare  The compare
   *
   * @return     object  The adjacent post.
   */
  private static function get_adjacent_post($post, $module, $compare = ">") {
    $adjacent_posts = get_posts([
      "post_type" => "learning",
      "numberposts" => -1,
      "meta_query" => [
        [
          "key" => "order",
          "compare" => $compare,
          "value" => $post->fields->order,
          "type" => "NUMERIC",
        ],
      ],
      "tax_query" => [
        [
          "taxonomy" => "learning_topic",
          "field" => "term_id",
          "terms" => $module->term_id,
        ],
      ],
    ]);

    foreach ($adjacent_posts as &$a_post) {
      $a_post->fields = apply_filters("dp/filter_acf_fields", get_field_objects($a_post), "dp-article", ["linked_learning_articles"]);
    }

    usort($adjacent_posts, "\Simplicity\Helper::sort_by_order");

    if ($compare == ">") {
      return isset($adjacent_posts[0]) ? $adjacent_posts[0] : null;
    } else {
      return count($adjacent_posts) > 0 ? array_pop($adjacent_posts) : null;
    }
  }

  /**
   * Gets the adjacent module based upon custom field "order"
   *
   * @param      object      $module   The module
   * @param      string      $compare  The compare
   *
   * @return     object|null           The adjacent module or nil.
   */
  private static function get_adjacent_module($module, $compare = ">") {
    $forbidden_categories = Helper::get_forbidden_learning_categories();

    $adjacent_modules = get_terms([
      "hide_empty" => false,
      "taxonomy" => "learning_topic",
      "number" => 0,
      "parent" => $module->parent,
      "exclude" => $forbidden_categories,
      "meta_query" => [
        [
          "key" => "order",
          "compare" => $compare,
          "value" => $module->fields->order,
          "type" => "NUMERIC",
        ]
      ]
    ]);

    foreach($adjacent_modules as &$a_module) {
      $a_module->fields = new \stdClass();
      $a_module->fields->order = get_field("order", $a_module);
    }

    usort($adjacent_modules, "\Simplicity\Helper::sort_by_order");

    if($compare == ">") {
      return isset($adjacent_modules[0]) ? $adjacent_modules[0] : null;
    } else {
      return count($adjacent_modules) > 0 ? array_pop($adjacent_modules) : null;
    }
  }

  /**
   * Gets the adjacent topic based upon custom field "order"
   *
   * @param   object  $topic    The topic
   * @param   string  $compare  The compare
   *
   * @return  object|null
   */
  private static function get_adjacent_topic($topic, $compare = ">") {
    $forbidden_categories = Helper::get_forbidden_learning_categories();

    $adjacent_topics = get_terms([
      "hide_empty" => true,
      "taxonomy" => "learning_topic",
      "number" => 0,
      "parent" => 0,
      "exclude" => $forbidden_categories,
      "meta_query" => [
        [
          "key" => "order",
          "compare" => $compare,
          "value" => $topic->fields->order,
          "type" => "NUMERIC",
        ]
      ]
    ]);

    foreach($adjacent_topics as &$a_topic) {
      $a_topic->fields = apply_filters("dp/filter_acf_fields", get_field_objects($a_topic), "dp-category");
    }

    usort($adjacent_topics, "\Simplicity\Helper::sort_by_order");

    if($compare == ">") {
      return isset($adjacent_topics[0]) ? $adjacent_topics[0] : null;
    } else {
      return count($adjacent_topics) > 0 ? array_pop($adjacent_topics) : null;
    }
  }

  /**
   * maybe set module as completed for user
   *
   * @param   int   $module_id  module id
   * @param   int   $user_id    user id
   *
   * @return  bool              module completed
   */
  private static function maybe_complete_module($module_id, $user_id) {
    global $wpdb;
    // check if module is already completed
    $already_completed = $wpdb->get_var("SELECT completed_id FROM {$wpdb->prefix}completed_modules WHERE module_id = {$module_id} AND user_id = {$user_id};");

    if(!is_null($already_completed)) {
      return true;
    }

    // set module as completed
    // if all containing articles have been read
    $sql = "
      SELECT
        user_id,
        module_id,
        tt.count as existing_articles,
        COUNT(*) as read_articles
      FROM
        {$wpdb->prefix}reading_progress as rp
      LEFT JOIN
        {$wpdb->term_taxonomy} as tt ON rp.module_id = tt.term_id
      LEFT JOIN
        {$wpdb->posts} as p ON rp.article_id = p.ID
      WHERE
        rp.article_id IS NOT NULL
        AND rp.module_id = {$module_id}
        AND rp.user_id = {$user_id}
        AND p.post_status = 'publish'
      GROUP BY
        rp.module_id, rp.user_id
    ";

    $result = $wpdb->get_row($sql, OBJECT);

    if($result && ((int)$result->read_articles >= (int)$result->existing_articles)) {
      $wpdb->insert(
        "{$wpdb->prefix}completed_modules",
        [
          "module_id" => $module_id,
          "user_id" => $user_id,
          "completed_date" => current_time("mysql")
        ]
      );

      return true;
    }

    return false;
  }

  private static function maybe_complete_topic($topic_id, $user_id) {
    global $wpdb;

    // check if module is already completed
    $already_completed = $wpdb->get_var("SELECT completed_id FROM {$wpdb->prefix}completed_topics WHERE topic_id = {$topic_id} AND user_id = {$user_id};");

    if(!is_null($already_completed)) {
      return true;
    }

    $forbidden_categories = Helper::get_forbidden_learning_categories();

    // get modules by topic id which are not empty
    $sql = "
      SELECT
        GROUP_CONCAT(term_id) as modules
      FROM
        {$wpdb->term_taxonomy}
      WHERE
        count > 0
        AND taxonomy = 'learning_topic'
        AND parent = {$topic_id}
        " . (!empty($forbidden_categories) ? " AND term_id NOT IN (" . join(",", $forbidden_categories) . ")" : "" ) . "
      GROUP BY
        parent
    ";

    $result = $wpdb->get_row($sql);

    // if there are modules,
    // check if completed modules equals modules
    if($result !== NULL) {
      $count = count(explode(",", $result->modules));

      $sql = "
        SELECT
          count(distinct module_id) = {$count} as completed
        FROM
          {$wpdb->prefix}completed_modules
        WHERE
          module_id in ({$result->modules})
          AND user_id = {$user_id}
        GROUP BY
          user_id
      ";

      $completed = $wpdb->get_row($sql, OBJECT);

      // mark as completed if possible
      if((int)$completed->completed === 1) {
        $wpdb->insert(
          "{$wpdb->prefix}completed_topics",
          [
            "topic_id" => $topic_id,
            "user_id" => $user_id,
            "completed_date" => current_time("mysql"),
          ]
        );

        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

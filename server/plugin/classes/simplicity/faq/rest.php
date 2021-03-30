<?php

namespace Simplicity\FAQ;

use Simplicity\Helper;
use WP_Error;
use WP_Query;

final class REST {
  public static function init() {
    add_action("rest_api_init", __CLASS__ . "::register_rest_routes");
  }

  public static function register_rest_routes() {
    // dp/v1/faq/categories
    register_rest_route("dp/v1", "/faq/categories", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_faq_categories",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);

    // dp/v1/faq/articles/:category_id
    register_rest_route("dp/v1", "/faq/articles/(?P<id>\d+)", [
      "methods" => "GET",
      "callback" => __CLASS__ . "::rest_faq_articles_by_category",
      "permission_callback" => "\Simplicity\REST::rest_check_user_logged_in",
    ]);
  }

  /**
   * REST: get faq categories
   *
   * @return  array  ordered faq categories
   */
  public static function rest_faq_categories() {
    $categories = get_terms("faq_category", [
      "hide_empty" => true,
      "parent" => 0,
    ]);

    $result = [];

    foreach($categories as $category) {
      $category->fields = apply_filters("dp/filter_acf_fields", get_field_objects($category), "dp-category", []);

      array_push($result, $category);
    }

    usort($result, "\Simplicity\Helper::sort_by_order");

    return $result;
  }

  public static function rest_faq_articles_by_category($request) {
    $id = intval($request["id"]);
    $query = $request->get_query_params();
    $has_permission = false;
    $result = [];

    $category = get_term($id, "faq_category");

    if(!$category) {
      return new WP_Error(
        "[dps] category does not exist",
        "the requested category does not exist",
        ["status" => 404]
      );
    }

    $category->fields = apply_filters("dp/filter_acf_fields", get_field_objects($category), "dp-category", []);

    // get translated category
    $category->translations = Helper::get_taxonomy_translations($category->term_id, "faq_category");

    // get articles
    $articles = get_posts([
      "posts_per_page" => (isset($query["posts_per_page"]) ? absint($query["posts_per_page"]) : -1),
      "offset" => (isset($query["offset"]) ? absint($query["offset"]) : 0),
      "post_type" => "faq",
      "post_status" => ["draft", "publish"],
      "tax_query" => [
        [
          "taxonomy" => "faq_category",
          "field" => "term_id",
          "terms" => $category->term_id,
        ]
      ],
    ]);

    // preview
    if(isset($query["preview"]) && current_user_can("edit_posts")) {
      $has_permission = true;
    }

    foreach($articles as $article) {
      if($article->post_status !== "publish" && !$has_permission) {
        continue;
      }

      if($has_permission && $revisions = wp_get_post_revisions($article->ID)) {
        $last_revision = reset($revisions);
        $rev = wp_get_post_revision($last_revision->ID);
        $article->post_content = $rev->post_content;
        $article->post_title = $rev->post_title;
      }

      array_push($result, [
        "ID" => $article->ID,
        "post_title" => $article->post_title,
        "post_excerpt" => $article->post_excerpt | "",
        "post_name" => $article->post_name,
        "post_date" => $article->post_date,
        "post_date_gmt" => $article->post_date_gmt,
        "post_content" => apply_filters("the_content", $article->post_content),
        "fields" => apply_filters("dp/filter_acf_fields", get_field_objects($article), "dp-article", ["linked_knowledge_articles"]),
      ]);
    }

    usort($result, "\Simplicity\Helper::sort_by_order");

    return [
      "category" => $category,
      "articles" => $result,
    ];
  }
}

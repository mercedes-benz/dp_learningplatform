<?php

namespace Simplicity\Knowledge;

use Simplicity\Helper;

final class Base {
  /**
   * init
   */
  public static function init() {
    add_action("plugins_loaded", __CLASS__ . "::setup_hooks");
  }

  /**
   * setup hooks
   */
  public static function setup_hooks() {
    add_action("init", __CLASS__ . "::register_taxonomy");
    add_action("init", __CLASS__ . "::register_post_type");

    add_action("after_setup_theme", __CLASS__ . "::register_acf", 99);
    add_action("admin_enqueue_scripts", __CLASS__ . "::inject_preselect_category_script", 10);

    add_filter("manage_edit-knowledge_category_columns", __CLASS__ . "::knowledge_category_columns");
    add_filter("manage_knowledge_category_custom_column", __CLASS__ . "::knowledge_category_custom_column", 10, 3);
    add_filter("wp_terms_checklist_args", __CLASS__ . "::terms_change_checklist");
    add_filter("post_type_link/knowledge", __CLASS__ . "::post_type_link", 10, 3);
    add_filter("preview_post_link/knowledge", __CLASS__ . "::preview_post_link", 10, 3);
  }

  /**
   * registers taxonomies
   */
  public static function register_taxonomy() {
    // knowledge categories
    register_taxonomy("knowledge_category", "knowledge", [
      "labels" => [
        "name" => __("Categories / subcategories", "dp"),
        "singular_name" => __("Category", "dp"),
        "all_items" => __("All categories", "dp"),
        "edit_item" => __("Edit category", "dp"),
        "view_item" => __("View category", "dp"),
        "update_item" => __("Update category", "dp"),
        "add_new_item" => __("Add new category / subcategory", "dp"),
        "parent_item" => __("Parent category", "dp"),
        "search_items" => __("Search categories / subcategories", "dp"),
        "back_to_items" => __("← Back to categories", "dp"),
      ],
      "rewrite" => ["slug" => "category"],
      "hierarchical" => true,
      "show_admin_column" => true,
      "show_in_quick_edit" => true,
    ]);
  }

  /**
   * registers post types
   */
  public static function register_post_type() {
    // knowledge
    register_post_type("knowledge", [
      "labels" => [
        "name" => __("Library", "dp"),
        "singular_name" => __("Library Article", "dp"),
        "all_items" => __("Articles", "dp"),
      ],
      "supports" => ["title", "revisions", "editor", "excerpt", "custom-fields", "comments"],
      "taxonomies" => ["knowledge_category"],
      "public" => true,
      "has_archive" => false,
      "hierarchical" => false,
      "exclude_from_search" => false,
      "show_in_rest" => false,
    ]);
  }

  /**
   * add column to knowledge_category admin ui
   *
   * @param      array  $columns  The columns
   *
   * @return     array  Filtered column
   */
  public static function knowledge_category_columns($columns) {
    $columns["order"] = __("Order", "dp");

    return $columns;
  }

  /**
   * add column values to knowledge_category custom column
   *
   * @param      string  $deprecated   Deprecated value
   * @param      string  $column_name  The column name
   * @param      int     $term_id      The term identifier
   *
   * @return     string  Field value
   */
  public static function knowledge_category_custom_column($deprecated, $column_name, $term_id) {
    if ($column_name == "order") {
      $term = get_term($term_id, "knowledge_category");
      return get_field("order", $term);
    }
  }

  /**
   * knowledge_category backend selection
   * change checkboxes to radio buttons
   *
   * @param      array  $args   The arguments
   *
   * @return     array          New arguments
   */
  public static function terms_change_checklist($args) {
    require_once DP_PLUGIN_DIR . "classes/taxonomy-walker.php";

    if (!empty($args["taxonomy"]) && $args["taxonomy"] === "knowledge_category") {
      $args["walker"] = new \DP_Taxonomy_Walker();
      $args["checked_ontop"] = false;
      $args["popular_cats"] = ["0"];
      $args["selected_cats"] = false;
    }

    return $args;
  }

  /**
   * register acf fields
   */
  public static function register_acf() {
    if (function_exists('acf_add_local_field_group')) {
      // knowledge
      acf_add_local_field_group([
        'key' => 'group_5b31ddd8896c7',
        'title' => __("Library", "dp"),
        'fields' => [
          [
            'key' => 'field_5b5592d127fb6',
            'label' => __("Order", "dp"),
            'name' => 'order',
            'type' => 'number',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => 0,
            'wrapper' => [
              'width' => '',
              'class' => '',
              'id' => '',
            ],
            'default_value' => 0,
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'maxlength' => '',
          ],
          [
            'key' => 'field_5b9b62576c45e',
            'label' => __("Reading time", "dp"),
            'name' => 'reading_time',
            'type' => 'number',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => 0,
            'wrapper' => [
              'width' => '',
              'class' => '',
              'id' => '',
            ],
            'default_value' => 0,
            'placeholder' => '',
            'prepend' => '',
            'append' => __("minutes", "dp"),
            'min' => 0,
            'max' => 999,
            'step' => 1,
          ],
          [
            'key' => 'field_5baa27a9375d3',
            'label' => __("Tag", "dp"),
            'name' => 'tag',
            'type' => 'select',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => 0,
            'wrapper' => [
              'width' => '',
              'class' => '',
              'id' => '',
            ],
            'choices' => Helper::get_knowledge_tags(),
            'default_value' => [
              0 => 'default',
            ],
            'allow_null' => 0,
            'multiple' => 1,
            'ui' => 1,
            'return_format' => 'value',
            'ajax' => 0,
            'placeholder' => '',
          ],
          [
            'key' => 'field_5b31ddf778ed3',
            'label' => __("Linked library articles", "dp"),
            'name' => 'linked_knowledge_articles',
            'type' => 'relationship',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => [
              'width' => '',
              'class' => '',
              'id' => '',
            ],
            'post_type' => [
              0 => 'knowledge',
            ],
            'taxonomy' => [
            ],
            'filters' => [
              0 => 'search',
              1 => 'post_type',
              2 => 'taxonomy',
            ],
            'elements' => '',
            'min' => '',
            'max' => 3,
            'return_format' => 'object',
          ],
          [
            'key' => 'field_5b31dfaa32eb3',
            'label' => __("Views", "dp"),
            'name' => 'views',
            'type' => 'number',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => 0,
            'wrapper' => [
              'width' => '',
              'class' => '',
              'id' => '',
            ],
            'default_value' => 0,
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'min' => '',
            'max' => '',
            'step' => '',
          ],
        ],
        'location' => [
          [
            [
              'param' => 'post_type',
              'operator' => '==',
              'value' => 'knowledge',
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

      // knowledge topics
      acf_add_local_field_group([
        'key' => 'group_5b4615569c20a',
        'title' => __("Library topics", "dp"),
        'fields' => [
          [
            'key' => 'field_5b461573b445c',
            'label' => __("Image", "dp"),
            'name' => 'image',
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
            'preview_size' => 'dp-category',
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
            'key' => 'field_5b461594b445d',
            'label' => __("Order", "dp"),
            'name' => 'order',
            'type' => 'text',
            'instructions' => '',
            'required' => 1,
            'conditional_logic' => 0,
            'wrapper' => [
              'width' => '',
              'class' => '',
              'id' => '',
            ],
            'default_value' => '0',
            'placeholder' => '',
            'prepend' => '',
            'append' => '',
            'min' => 1,
            'max' => '',
            'step' => 1,
          ],
          [
            'key' => 'field_5b8d2bbfcb6bb',
            'label' => __("Exclude user roles", "dp"),
            'name' => 'exclude_roles',
            'type' => 'select',
            'instructions' => '',
            'required' => 0,
            'conditional_logic' => 0,
            'wrapper' => [
              'width' => '',
              'class' => '',
              'id' => '',
            ],
            'choices' => Helper::get_custom_user_roles(false),
            'default_value' => [
            ],
            'allow_null' => 0,
            'multiple' => 1,
            'ui' => 1,
            'ajax' => 0,
            'return_format' => 'value',
            'placeholder' => '',
          ],
        ],
        'location' => [
          [
            [
              'param' => 'taxonomy',
              'operator' => '==',
              'value' => 'knowledge_category',
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
  }

  public static function inject_preselect_category_script() {
    wp_enqueue_script("simplicity-preselect-category-order", DP_PLUGIN_URL . "/assets/js/preselect_first_category.js", ["jquery"], false, true);
  }

  /**
   * post type link
   *
   * @param   string  $post_link  post link
   * @param   object  $post       post
   * @param   string  $lang_code  wpml language code
   *
   * @return  string              filtered post link
   */
  public static function post_type_link($post_link, $post, $lang_code) {
    return DP_FRONTEND_URL . "/{$lang_code}/knowledge/article/{$post->ID}/";
  }

  /**
   * preview post link
   *
   * @param   string  $preview_link  preview link
   * @param   object  $post          post
   * @param   string  $lang_code     wpml language code
   *
   * @return  string                 filtered preview link
   */
  public static function preview_post_link($preview_link, $post, $lang_code) {
      return DP_FRONTEND_URL . "/{$lang_code}/knowledge/article/{$post->ID}/?preview";
  }
}

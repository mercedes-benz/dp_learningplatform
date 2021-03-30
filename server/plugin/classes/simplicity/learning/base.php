<?php

namespace Simplicity\Learning;

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
    add_action("save_post_learning", __CLASS__ . "::update_reading_progress", 10, 3);
    add_action("admin_enqueue_scripts", __CLASS__ . "::inject_hide_read_in_order_script", 10);
    add_action("admin_enqueue_scripts", __CLASS__ . "::inject_hide_tags_script", 10);
    add_action("admin_enqueue_scripts", __CLASS__ . "::inject_preselect_category_script", 10);

    add_filter("manage_edit-learning_topic_columns", __CLASS__ . "::learning_topic_columns");
    add_filter("manage_learning_topic_custom_column", __CLASS__ . "::learning_topic_custom_column", 10, 3);
    add_filter("wp_terms_checklist_args", __CLASS__ . "::terms_change_checklist");
    add_filter("post_type_link/learning", __CLASS__ . "::post_type_link", 10, 3);
    add_filter("preview_post_link/learning", __CLASS__ . "::preview_post_link", 10, 3);
  }

  /**
   * registers taxonomies
   */
  public static function register_taxonomy() {
    // learning topics
    register_taxonomy("learning_topic", "learning", [
      "labels" => [
        "name" => __("Topics / modules", "dp"),
        "singular_name" => __("Topic / module", "dp"),
        "all_items" => __("All topics / modules", "dp"),
        "edit_item" => __("Edit topic / module", "dp"),
        "view_item" => __("View topic / module", "dp"),
        "update_item" => __("Update topic / module", "dp"),
        "add_new_item" => __("Add new topic / module", "dp"),
        "parent_item" => __("Parent topic", "dp"),
        "search_items" => __("Search topics / modules", "dp"),
        "back_to_items" => __("← Back to topics / modules", "dp"),
      ],
      "rewrite" => ["slug" => "topic"],
      "hierarchical" => true,
      "show_admin_column" => true,
      "show_in_quick_edit" => true,
    ]);
  }

  /**
   * registers post types
   */
  public static function register_post_type() {
    // learning
    register_post_type("learning", [
      "labels" => [
        "name" => __("Academy", "dp"),
        "singular_name" => __("Academy Article", "dp"),
        "all_items" => __("Articles", "dp"),
      ],
      "supports" => ["title", "revisions", "editor", "excerpt", "custom-fields"],
      "taxonomies" => ["learning_topic"],
      "public" => true,
      "has_archive" => false,
      "hierarchical" => false,
      "exclude_from_search" => false,
      "show_in_rest" => false,
    ]);
  }

  /**
   * @return null
   */
  public static function register_acf() {
    if (!function_exists('acf_add_local_field_group')) {
      return;
    }

    // learning
    acf_add_local_field_group([
      'key' => 'group_5bc5e49235000',
      'title' => __("Academy", "dp"),
      'fields' => [
        [
          'key' => 'field_5bc5e4a4d6129',
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
          'min' => 0,
          'max' => '',
          'step' => 1,
        ],
        [
          'key' => 'field_5bc5e4bed612a',
          'label' => __("Reading time", "dp"),
          'name' => 'reading_time',
          'type' => 'number',
          'instructions' => '',
          'required' => 0,
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
          'max' => '',
          'step' => '',
        ],
        [
          'key' => 'field_5bc5e526d612c',
          'label' => __("Linked academy articles", "dp"),
          'name' => 'linked_learning_articles',
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
            0 => 'learning',
          ],
          'taxonomy' => '',
          'filters' => [
            0 => 'search',
            1 => 'taxonomy',
          ],
          'elements' => '',
          'min' => '',
          'max' => 3,
          'return_format' => 'object',
        ],
        [
          'key' => 'field_5bc5e560d612d',
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
          'min' => 0,
          'max' => '',
          'step' => 1,
        ],
      ],
      'location' => [
        [
          [
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'learning',
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

    // learning topic
    acf_add_local_field_group([
      "key" => "group_5bc5d60dd217e",
      "title" => __("Academy topics", "dp"),
      "fields" => [
        [
          'key' => 'field_5bf53ca8e0786',
          'label' => __('Difficulty', 'dp'),
          'name' => 'difficulty',
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
            'Beginner' => 'Beginner',
            'Intermediate' => 'Intermediate',
            'Expert' => 'Expert',
          ],
          'default_value' => [
            0 => 'Beginner',
          ],
          'allow_null' => 0,
          'multiple' => 0,
          'ui' => 0,
          'return_format' => 'value',
          'ajax' => 0,
          'placeholder' => '',
        ],
        [
          "key" => "field_5be2a624ec6cf",
          "label" => __("Read in order", "dp"),
          "name" => "read_in_order",
          "type" => "true_false",
          "instructions" => "",
          "required" => 0,
          "conditional_logic" => 0,
          "wrapper" => [
            "width" => "",
            "class" => "",
            "id" => "",
          ],
          "message" => '',
          "default_value" => 0,
          "ui" => 1,
          "ui_on_text" => '',
          "ui_off_text" => '',
        ],
        [
          "key" => "field_5bc5d64a88395",
          "label" => __("Image", "dp"),
          "name" => "image",
          "type" => "image",
          "instructions" => '',
          "required" => 0,
          "conditional_logic" => 0,
          "wrapper" => [
            "width" => '',
            "class" => '',
            "id" => '',
          ],
          "return_format" => "id",
          "preview_size" => "dp-category",
          "library" => "uploadedTo",
          "min_width" => "",
          "min_height" => "",
          "min_size" => "",
          "max_width" => "",
          "max_height" => "",
          "max_size" => "",
          "mime_types" => "",
        ],
        [
          "key" => "field_5bc5d67588396",
          "label" => __("Order", "dp"),
          "name" => "order",
          "type" => "number",
          "instructions" => "",
          "required" => 1,
          "conditional_logic" => 0,
          "wrapper" => [
            "width" => "",
            "class" => "",
            "id" => "",
          ],
          "default_value" => 0,
          "placeholder" => '',
          "prepend" => '',
          "append" => '',
          "min" => 0,
          "max" => '',
          "step" => 1,
        ],
        [
          'key' => 'field_5bc5e4f2d612b',
          'label' => __("Tag", "dp"),
          'name' => 'learning_tag',
          'type' => 'select',
          'instructions' => '',
          'required' => 0,
          'conditional_logic' => 0,
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'choices' => Helper::get_learning_tags(),
          'default_value' => [
          ],
          'allow_null' => 0,
          'multiple' => 0,
          'ui' => 0,
          'return_format' => 'value',
          'ajax' => 0,
          'placeholder' => '',
        ],
        [
          'key' => 'field_5bc5d6ae88397',
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
            'value' => 'learning_topic',
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

    // article type
    acf_add_local_field_group([
      'key' => 'group_5e44eba706197',
      'title' => __('Article type', 'dp'),
      'fields' => [
        [
          'key' => 'field_5e44ebacd475d',
          'label' => __('Article type', 'dp'),
          'name' => 'article_type',
          'type' => 'radio',
          'instructions' => '',
          'required' => 0,
          'conditional_logic' => 0,
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'choices' => [
            'article' => __('Article', 'dp'),
            'quiz' => __('Quiz', 'dp'),
            'video' => __('Video', 'dp'),
          ],
          'allow_null' => 0,
          'other_choice' => 0,
          'default_value' => 'article',
          'layout' => 'horizontal',
          'return_format' => 'value',
          'save_other_choice' => 0,
        ],
        [
          'key' => 'field_5ca1f00fd2ee1',
          'label' => __('Choose quiz', 'dp'),
          'name' => 'quiz_id',
          'type' => 'post_object',
          'instructions' => '',
          'required' => 0,
          'conditional_logic' => [
            [
              [
                'field' => 'field_5e44ebacd475d',
                'operator' => '==',
                'value' => 'quiz',
              ],
            ],
          ],
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'post_type' => [
            0 => 'quiz',
          ],
          'taxonomy' => '',
          'allow_null' => 0,
          'multiple' => 0,
          'return_format' => 'id',
          'ui' => 1,
        ],
        [
          'key' => 'field_5ca1f00fd2ee2',
          'label' => __('Choose video', 'dp'),
          'name' => 'video_id',
          'type' => 'post_object',
          'instructions' => '',
          'required' => 0,
          'conditional_logic' => [
            [
              [
                'field' => 'field_5e44ebacd475d',
                'operator' => '==',
                'value' => 'video',
              ],
            ],
          ],
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'post_type' => [
            0 => 'video',
          ],
          'taxonomy' => '',
          'allow_null' => 0,
          'multiple' => 0,
          'return_format' => 'id',
          'ui' => 1,
        ],
      ],
      'location' => [
        [
          [
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'learning',
          ],
        ],
      ],
      'menu_order' => 0,
      'position' => 'normal',
      'style' => 'default',
      'label_placement' => 'top',
      'instruction_placement' => 'label',
      'hide_on_screen' => '',
      'active' => true,
      'description' => '',
    ]);
  }

  /**
   * add column to learning_topic admin ui
   *
   * @param      array  $columns  The columns
   *
   * @return     array  Filtered column
   */
  public static function learning_topic_columns($columns) {
    $columns["order"] = __("Order", "dp");

    return $columns;
  }

  /**
   * add column values to learning_topic custom column
   *
   * @param      string  $deprecated   Deprecated value
   * @param      string  $column_name  The column name
   * @param      int     $term_id      The term identifier
   *
   * @return     string  Field value
   */
  public static function learning_topic_custom_column($deprecated, $column_name, $term_id) {
    if ($column_name == "order") {
      $term = get_term($term_id, "learning_topic");
      return get_field("order", $term);
    }
  }

  /**
   * learning_topic backend selection
   * change checkboxes to radio buttons
   *
   * @param      array  $args   The arguments
   *
   * @return     array          New arguments
   */
  public static function terms_change_checklist($args) {
    require_once DP_PLUGIN_DIR . "classes/taxonomy-walker.php";

    if (!empty($args["taxonomy"]) && $args["taxonomy"] === "learning_topic") {
      $args["walker"] = new \DP_Taxonomy_Walker();
      $args["checked_ontop"] = false;
      $args["popular_cats"] = ["0"];
      $args["selected_cats"] = false;
    }

    return $args;
  }

  public static function update_reading_progress($id, $post, $is_update) {
    if (!$is_update) {
      return;
    }

    global $wpdb;

    $module = get_the_terms($post, "learning_topic")[0];
    $module_id = $module->term_id;

    $wpdb->update(
      "{$wpdb->prefix}reading_progress",
      ["module_id" => $module_id],
      ["article_id" => $post->ID],
      ["module_id" => "%d"],
      ["article_id" => "%d"]
    );
  }

  public static function inject_hide_read_in_order_script() {
    wp_enqueue_script("simplicity-toggle-read-in-order", DP_PLUGIN_URL . "/assets/js/toggle_read_in_order.js", [], false, true);
  }

  public static function inject_hide_tags_script() {
    wp_enqueue_script("simplicity-toggle-learning-tags", DP_PLUGIN_URL . "/assets/js/toggle_learning_tags.js", [], false, true);
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
    return DP_FRONTEND_URL . "/{$lang_code}/learning/article/{$post->ID}/";
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
      return DP_FRONTEND_URL . "/{$lang_code}/learning/article/{$post->ID}/?preview";
  }
}

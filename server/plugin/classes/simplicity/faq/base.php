<?php

namespace Simplicity\FAQ;

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
    add_action("admin_enqueue_scripts", __CLASS__ . "::title_character_limit");

    add_filter("manage_edit-faq_category_columns", __CLASS__ . "::faq_category_columns");
    add_filter("manage_faq_category_custom_column", __CLASS__ . "::faq_category_custom_column", 10, 3);

    add_filter("post_type_link/faq", __CLASS__ . "::post_type_link", 10, 3);
    add_filter("preview_post_link/faq", __CLASS__ . "::preview_post_link", 10, 3);
  }

  /**
   * registers taxonomies
   */
  public static function register_taxonomy() {
    register_taxonomy("faq_category", "faq", [
      "labels" => [
        "name" => __("Categories", "dp"),
        "singular_name" => __("Category", "dp"),
        "all_items" => __("All categories", "dp"),
        "edit_item" => __("Edit category", "dp"),
        "view_item" => __("View category", "dp"),
        "update_item" => __("Update category", "dp"),
        "add_new_item" => __("Add new category", "dp"),
        "parent_item" => __("Parent category", "dp"),
        "search_items" => __("Search categories", "dp"),
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
    register_post_type("faq", [
      "labels" => [
        "name" => __("FAQ", "dp"),
        "singular_name" => __("Article", "dp"),
        "all_items" => __("All Articles", "dp"),
      ],
      "supports" => ["title", "revisions", "editor", "custom-fields"],
      "taxonomies" => ["faq_category"],
      "public" => true,
      "has_archive" => false,
      "hierarchical" => false,
      "exclude_from_search" => false,
      "show_in_rest" => false,
    ]);
  }

  /**
   * register acf fields
   */
  public static function register_acf() {
    if (!function_exists('acf_add_local_field_group')) {
      return;
    }

    // faq
    acf_add_local_field_group([
      'key' => 'group_5bfbdb4c9562e',
      'title' => 'FAQ',
      'fields' => [
        [
          'key' => 'field_5bfbf0c12980e',
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
          'min' => '',
          'max' => '',
          'step' => '',
        ],
        [
          'key' => 'field_5bfbdb51ef525',
          'label' => __("Button", "dp"),
          'name' => 'button',
          'type' => 'group',
          'instructions' => '',
          'required' => 0,
          'conditional_logic' => 0,
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'layout' => 'row',
          'sub_fields' => [
            [
              'key' => 'field_5bfbdb71ef526',
              'label' => __("Show button?", "dp"),
              'name' => 'show',
              'type' => 'true_false',
              'instructions' => '',
              'required' => 0,
              'conditional_logic' => 0,
              'wrapper' => [
                'width' => '',
                'class' => '',
                'id' => '',
              ],
              'message' => '',
              'default_value' => 0,
              'ui' => 0,
              'ui_on_text' => '',
              'ui_off_text' => '',
            ],
            [
              'key' => 'field_5bfbdb8eef527',
              'label' => __("Link", "dp"),
              'name' => 'link',
              'type' => 'text',
              'instructions' => '',
              'required' => 0,
              'conditional_logic' => [
                [
                  [
                    'field' => 'field_5bfbdb71ef526',
                    'operator' => '==',
                    'value' => '1',
                  ],
                ],
              ],
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
              'key' => 'field_5bfbdb9eef528',
              'label' => __("Target", "dp"),
              'name' => 'target',
              'type' => 'select',
              'instructions' => '',
              'required' => 0,
              'conditional_logic' => [
                [
                  [
                    'field' => 'field_5bfbdb71ef526',
                    'operator' => '==',
                    'value' => '1',
                  ],
                ],
              ],
              'wrapper' => [
                'width' => '',
                'class' => '',
                'id' => '',
              ],
              'choices' => [
                '_self' => __("Same window", "dp"),
                '_blank' => __("New window", "dp"),
              ],
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
              'key' => 'field_5bfbdbc0ef529',
              'label' => __("Text", "dp"),
              'name' => 'text',
              'type' => 'text',
              'instructions' => '',
              'required' => 0,
              'conditional_logic' => [
                [
                  [
                    'field' => 'field_5bfbdb71ef526',
                    'operator' => '==',
                    'value' => '1',
                  ],
                ],
              ],
              'wrapper' => [
                'width' => '',
                'class' => '',
                'id' => '',
              ],
              'default_value' => __("Read more", "dp"),
              'placeholder' => '',
              'prepend' => '',
              'append' => '',
              'maxlength' => '',
            ],
          ],
        ],
      ],
      'location' => [
        [
          [
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'faq',
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

    // faq category
    acf_add_local_field_group([
      'key' => 'group_5bfbd94d40104',
      'title' => __("FAQ category", "dp"),
      'fields' => [
        [
          'key' => 'field_5bfbd95bbe203',
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
          'min' => '',
          'max' => '',
          'step' => '',
        ],
      ],
      'location' => [
        [
          [
            'param' => 'taxonomy',
            'operator' => '==',
            'value' => 'faq_category',
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

  public static function title_character_limit() {
    $screen = get_current_screen();

    if($screen->post_type === "faq" && $screen->base === "post") {
      wp_enqueue_script("title_char_limit", DP_PLUGIN_URL . "/assets/js/faq_title_char_limit.js", [], false, true);
    }
  }

  /**
   * add column to faq_category admin ui
   *
   * @param      array  $columns  The columns
   *
   * @return     array  Filtered column
   */
  public static function faq_category_columns($columns) {
    $columns["order"] = __("Order", "dp");

    return $columns;
  }

  /**
   * add column values to faq_category custom column
   *
   * @param      string  $deprecated   Deprecated value
   * @param      string  $column_name  The column name
   * @param      int     $term_id      The term identifier
   *
   * @return     string  Field value
   */
  public static function faq_category_custom_column($deprecated, $column_name, $term_id) {
    if ($column_name == "order") {
      $term = get_term($term_id, "faq_category");
      return get_field("order", $term);
    }
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
    $category = get_the_terms($post->ID, "faq_category")[0];

    if($category !== NULL) {
      return DP_FRONTEND_URL . "/{$lang_code}/faq/articles/{$category->term_id}/";
    } else {
      return "#";
    }
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
    $category = get_the_terms($post->ID, "faq_category")[0];

    if($category !== NULL) {
      return DP_FRONTEND_URL . "/{$lang_code}/faq/articles/{$category->term_id}/?preview";
    } else {
      return "#";
    }
  }
}

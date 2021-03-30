<?php

namespace Simplicity\Video;

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
    add_action("init", __CLASS__ . "::register_post_type");
    add_action("after_setup_theme", __CLASS__ . "::register_acf", 99);
  }

  /**
   * get video file
   *
   * @param   int|string  $video_id  video post id
   *
   * @return  string                 video file url
   */
  public static function get($video_id) {
    return get_field("video_file", intval($video_id));
  }

  /**
   * register post type
   */
  public static function register_post_type() {
    register_post_type("video", [
      "labels" => [
        "name" => __("Videos", "dp"),
        "singular_name" => __("Video", "dp"),
        "all_items" => __("Videos", "dp"),
      ],
      "supports" => ["title", "custom-fields"],
      "public" => false,
      "has_archive" => false,
      "hierarchical" => false,
      "exclude_from_search" => true,
      "show_in_rest" => false,
      "show_ui" => true,
      "show_in_menu" => "edit.php?post_type=learning",
    ]);
  }

  /**
   * register acf
   */
  public static function register_acf() {
    if (!function_exists("acf_add_local_field_group")) {
      return;
    }

    acf_add_local_field_group([
      'key' => 'group_5e44f8cbd507d',
      'title' => __('Video', 'dp'),
      'fields' => [
        [
          'key' => 'field_5e44f948465bf',
          'label' => __('Video', 'dp'),
          'name' => 'video_file',
          'type' => 'file',
          'instructions' => '',
          'required' => 0,
          'conditional_logic' => 0,
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'return_format' => 'url',
          'library' => 'all',
          'min_size' => '',
          'max_size' => '',
          'mime_types' => 'mp4',
        ],
      ],
      'location' => [
        [
          [
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'video',
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
}

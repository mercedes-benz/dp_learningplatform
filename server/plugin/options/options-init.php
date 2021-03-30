<?php

/**
 * For full documentation, please visit: http://docs.reduxframework.com/
 * For a more extensive sample-config file, you may look at:
 * https://github.com/reduxframework/redux-framework/blob/master/sample/sample-config.php
 */

if (!class_exists('Redux')) {
  return;
}

add_action("after_setup_theme", "dp_init_redux", 20);

function dp_init_redux() {
  $opt_name = "dps_options";

  /**
   * args
   */

  $theme = wp_get_theme(); // For use with some settings. Not necessary.

  $args = [
    'opt_name' => $opt_name,
    'use_cdn' => true,
    'display_name' => __("SIMPLICITY", "dp"),
    'page_slug' => 'dps_options',
    'page_title' => __("Options", "dp"),
    'update_notice' => true,
    'menu_type' => 'menu',
    'menu_title' => __("SIMPLICITY", "dp"),
    'allow_sub_menu' => true,
    'page_priority' => '9999',
    'customizer' => true,
    'default_mark' => '*',
    'hints' => [
      'icon_position' => 'right',
      'icon_color' => 'lightgray',
      'icon_size' => 'normal',
      'tip_style' => [
        'color' => 'light',
      ],
      'tip_position' => [
        'my' => 'top left',
        'at' => 'bottom right',
      ],
      'tip_effect' => [
        'show' => [
          'duration' => '500',
          'event' => 'mouseover',
        ],
        'hide' => [
          'duration' => '500',
          'event' => 'mouseleave unfocus',
        ],
      ],
    ],
    'output' => true,
    'output_tag' => true,
    'settings_api' => true,
    'cdn_check_time' => '3600',
    'compiler' => true,
    'page_permissions' => 'manage_options',
    'save_defaults' => true,
    'show_import_export' => true,
    'database' => 'options',
    'transient_time' => '3600',
    'network_sites' => true,
  ];

  Redux::setArgs($opt_name, $args);

  /**
   * sections
   */

  // Access
  Redux::setSection($opt_name, [
    'title' => __('Access', 'dp'),
    'id' => 'access',
    'desc' => false,
    'icon' => 'el el-home',
  ]);

  // Access - User roles
  Redux::setSection($opt_name, [
    'title' => __('User roles', 'dp'),
    'desc' => false,
    'id' => 'opt-access-roles-subsection',
    'subsection' => true,
    'fields' => [
      [
        'id' => 'custom_roles',
        'type' => 'multi_text',
        'title' => __("Custom roles", "dp"),
        "subtitle" => __("Will be used for access restriction in frontend", "dp"),
        'default' => false,
        "add_text" => __("Add more", "dp"),
      ],
    ],
  ]);

  // Knowledge
  Redux::setSection($opt_name, [
    "title" => __("Library", "dp"),
    "id" => "knowledge",
    "desc" => false,
    "icon" => "el el-bullhorn",
  ]);

  // Knowledge – Tags
  Redux::setSection($opt_name, [
    "title" => __("Tags", "dp"),
    "desc" => false,
    "id" => "opt-knowledge-tags-subsection",
    "subsection" => true,
    "fields" => [
      [
        "id" => "knowledge_tags",
        "type" => "multi_text",
        "title" => __("Tags", "dp"),
        "subtitle" => __("Will be used for filtering the library articles", "dp"),
        "default" => false,
        "add_text" => __("Add more", "dp"),
      ],
    ],
  ]);

  // Learning
  Redux::setSection($opt_name, [
    "title" => __("Academy", "dp"),
    "id" => "learning",
    "desc" => false,
    "icon" => "el el-book",
  ]);

  Redux::setSection($opt_name, [
    "title" => __("Tags", "dp"),
    "desc" => false,
    "id" => "opt-learning-tags-subsection",
    "subsection" => true,
    "fields" => [
      [
        "id" => "learning_tags",
        "type" => "multi_text",
        "title" => __("Tags", "dp"),
        "subtitle" => __("Will be used for filtering the academy articles", "dp"),
        "default" => false,
        "add_text" => __("Add more", "dp"),
      ],
    ],
  ]);
}

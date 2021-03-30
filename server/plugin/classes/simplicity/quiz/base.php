<?php

namespace Simplicity\Quiz;

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
    add_action("admin_enqueue_scripts", __CLASS__ . "::inject_toggle_single_choice_checkbox_script", 10);

    add_filter("dp/filter_quiz", __CLASS__ . "::filter_quiz");
    add_filter("dp/filter_quiz_values/assign", __CLASS__ . "::filter_quiz_assign");
    add_filter("dp/filter_quiz_values/order", __CLASS__ . "::filter_quiz_order");
  }

  public static function get($id) {
    $quiz = get_field("questions", $id);

    return [
      "can_be_skipped" => get_field("can_be_skipped", $id),
      "questions" => apply_filters("dp/filter_quiz", $quiz),
      "complete_success" => get_field("complete_success", $id),
      "complete_fail" => get_field("complete_fail", $id),
      "complete_fail_links" => get_field("complete_fail_links", $id),
    ];
  }

  /**
   * registers post type
   */
  public static function register_post_type() {
    register_post_type("quiz", [
      "labels" => [
        "name" => __("Quiz", "dp"),
        "singular_name" => __("Quiz", "dp"),
        "all_items" => __("Quiz", "dp"),
      ],
      "supports" => ["title", "revisions", "custom-fields"],
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
   * register acf fields
   */
  public static function register_acf() {
    if (!function_exists("acf_add_local_field_group")) {
      return;
    }

    acf_add_local_field_group([
      'key' => 'group_5c861af88b2cf',
      'title' => __('Quiz', "dp"),
      'fields' => [
        [
          'key' => 'field_5cb089a73f5b6',
          'label' => __('Can be skipped?', 'dp'),
          'name' => 'can_be_skipped',
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
          'key' => 'field_5c861b0430f16',
          'label' => __('Questions', "dp"),
          'name' => 'questions',
          'type' => 'repeater',
          'instructions' => '',
          'required' => 1,
          'conditional_logic' => 0,
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'collapsed' => 'field_5c861e0f5109b',
          'min' => 3,
          'max' => 0,
          'layout' => 'row',
          'button_label' => '',
          'sub_fields' => [
            [
              'key' => 'field_5c861c6f246c3',
              'label' => __('Type', "dp"),
              'name' => 'type',
              'type' => 'select',
              'instructions' => '',
              'required' => 1,
              'conditional_logic' => 0,
              'wrapper' => [
                'width' => '',
                'class' => '',
                'id' => '',
              ],
              'choices' => [
                'single_choice' => __('Single Choice', "dp"),
                'multiple_choice' => __('Multiple Choice', "dp"),
                'true_false' => __('True / false', "dp"),
                'assign' => __('Assignment', "dp"),
                'order' => __('Order', "dp"),
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
              'key' => 'field_5c861e0f5109b',
              'label' => __('Question', "dp"),
              'name' => 'title',
              'type' => 'textarea',
              'instructions' => '',
              'required' => 1,
              'conditional_logic' => 0,
              'wrapper' => [
                'width' => '',
                'class' => '',
                'id' => '',
              ],
              'default_value' => '',
              'placeholder' => '',
              'maxlength' => '',
              'rows' => 3,
              'new_lines' => 'wpautop',
            ],
            [
              'key' => 'field_5cb442fe32a03',
              'label' => __('Image', 'dp'),
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
              'preview_size' => 'thumbnail',
              'library' => 'all',
              'min_width' => '',
              'min_height' => '',
              'min_size' => '',
              'max_width' => '',
              'max_height' => '',
              'max_size' => '',
              'mime_types' => '',
            ],
            [
              'key' => 'field_5c861d0589881',
              'label' => __('Single Choice', "dp"),
              'name' => 'single_choice',
              'type' => 'repeater',
              'instructions' => '',
              'required' => 0,
              'conditional_logic' => [
                [
                  [
                    'field' => 'field_5c861c6f246c3',
                    'operator' => '==',
                    'value' => 'single_choice',
                  ],
                ],
              ],
              'wrapper' => [
                'width' => '',
                'class' => '',
                'id' => '',
              ],
              'collapsed' => 'field_5c861d8289882',
              'min' => 3,
              'max' => 6,
              'layout' => 'table',
              'button_label' => '',
              'sub_fields' => [
                [
                  'key' => 'field_5c861d8289882',
                  'label' => __('Answer', "dp"),
                  'name' => 'answer',
                  'type' => 'text',
                  'instructions' => '',
                  'required' => 1,
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
                  'key' => 'field_5c861d9189883',
                  'label' => __('Correct Answer', "dp"),
                  'name' => 'correct_answer',
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
              ],
            ],
            [
              'key' => 'field_5c861fc972668',
              'label' => __('Multiple Choice', "dp"),
              'name' => 'multiple_choice',
              'type' => 'repeater',
              'instructions' => '',
              'required' => 0,
              'conditional_logic' => [
                [
                  [
                    'field' => 'field_5c861c6f246c3',
                    'operator' => '==',
                    'value' => 'multiple_choice',
                  ],
                ],
              ],
              'wrapper' => [
                'width' => '',
                'class' => '',
                'id' => '',
              ],
              'collapsed' => '',
              'min' => 3,
              'max' => 12,
              'layout' => 'table',
              'button_label' => '',
              'sub_fields' => [
                [
                  'key' => 'field_5c861fdd72669',
                  'label' => __('Answer', "dp"),
                  'name' => 'answer',
                  'type' => 'text',
                  'instructions' => '',
                  'required' => 1,
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
                  'key' => 'field_5c8620077266a',
                  'label' => __('Correct Answer', "dp"),
                  'name' => 'correct_answer',
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
              ],
            ],
            [
              'key' => 'field_5c86202e7266b',
              'label' => __('True / false', "dp"),
              'name' => 'true_false',
              'type' => 'group',
              'instructions' => '',
              'required' => 0,
              'conditional_logic' => [
                [
                  [
                    'field' => 'field_5c861c6f246c3',
                    'operator' => '==',
                    'value' => 'true_false',
                  ],
                ],
              ],
              'wrapper' => [
                'width' => '',
                'class' => '',
                'id' => '',
              ],
              'layout' => 'row',
              'sub_fields' => [
                [
                  'key' => 'field_5c8623397266c',
                  'label' => __('Is true?', "dp"),
                  'name' => 'is_true',
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
                  'key' => 'field_5c8623487266d',
                  'label' => __('Label "true"', "dp"),
                  'name' => 'label_true',
                  'type' => 'text',
                  'instructions' => '',
                  'required' => 0,
                  'conditional_logic' => 0,
                  'wrapper' => [
                    'width' => '',
                    'class' => '',
                    'id' => '',
                  ],
                  'default_value' => 'True',
                  'placeholder' => '',
                  'prepend' => '',
                  'append' => '',
                  'maxlength' => '',
                ],
                [
                  'key' => 'field_5c8623597266e',
                  'label' => __('Label "false"', "dp"),
                  'name' => 'label_false',
                  'type' => 'text',
                  'instructions' => '',
                  'required' => 0,
                  'conditional_logic' => 0,
                  'wrapper' => [
                    'width' => '',
                    'class' => '',
                    'id' => '',
                  ],
                  'default_value' => 'False',
                  'placeholder' => '',
                  'prepend' => '',
                  'append' => '',
                  'maxlength' => '',
                ],
              ],
            ],
            [
              'key' => 'field_5c862bb5f7dce',
              'label' => __('Assign', "dp"),
              'name' => 'assign',
              'type' => 'repeater',
              'instructions' => '',
              'required' => 0,
              'conditional_logic' => [
                [
                  [
                    'field' => 'field_5c861c6f246c3',
                    'operator' => '==',
                    'value' => 'assign',
                  ],
                ],
              ],
              'wrapper' => [
                'width' => '',
                'class' => '',
                'id' => '',
              ],
              'collapsed' => '',
              'min' => 0,
              'max' => 0,
              'layout' => 'table',
              'button_label' => '',
              'sub_fields' => [
                [
                  'key' => 'field_5c863090f7dcf',
                  'label' => __('Term', "dp"),
                  'name' => 'term',
                  'type' => 'text',
                  'instructions' => '',
                  'required' => 1,
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
                  'key' => 'field_5c86309ff7dd0',
                  'label' => __('Assigned term', "dp"),
                  'name' => 'assigned',
                  'type' => 'text',
                  'instructions' => '',
                  'required' => 1,
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
              ],
            ],
            [
              'key' => 'field_5c863206f54cb',
              'label' => __('Order', "dp"),
              'name' => 'order',
              'type' => 'repeater',
              'instructions' => '',
              'required' => 0,
              'conditional_logic' => [
                [
                  [
                    'field' => 'field_5c861c6f246c3',
                    'operator' => '==',
                    'value' => 'order',
                  ],
                ],
              ],
              'wrapper' => [
                'width' => '',
                'class' => '',
                'id' => '',
              ],
              'collapsed' => '',
              'min' => 3,
              'max' => 0,
              'layout' => 'table',
              'button_label' => '',
              'sub_fields' => [
                [
                  'key' => 'field_5c86321af54cc',
                  'label' => __('Item', "dp"),
                  'name' => 'item',
                  'type' => 'text',
                  'instructions' => '',
                  'required' => 1,
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
              ],
            ],
            [
              'key' => 'field_5c86409a38c81',
              'label' => __('Incorrect Message', "dp"),
              'name' => 'incorrect_message',
              'type' => 'wysiwyg',
              'instructions' => 'Gets displayed if the answer was incorrect.',
              'required' => 1,
              'conditional_logic' => 0,
              'wrapper' => [
                'width' => '',
                'class' => '',
                'id' => '',
              ],
              'default_value' => '',
              'tabs' => 'visual',
              'toolbar' => 'basic',
              'media_upload' => 1,
              'delay' => 0,
            ],
          ],
        ],
        [
          'key' => 'field_5cb5c5c4a0b8b',
          'label' => __('Message when quiz completed successfully', 'dp'),
          'name' => 'complete_success',
          'type' => 'wysiwyg',
          'instructions' => '',
          'required' => 1,
          'conditional_logic' => 0,
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'default_value' => '',
          'tabs' => 'all',
          'toolbar' => 'basic',
          'media_upload' => 1,
          'delay' => 0,
        ],
        [
          'key' => 'field_5cb5c5fea0b8c',
          'label' => __('Message when failing the quiz', 'dp'),
          'name' => 'complete_fail',
          'type' => 'wysiwyg',
          'instructions' => '',
          'required' => 1,
          'conditional_logic' => 0,
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'default_value' => '',
          'tabs' => 'all',
          'toolbar' => 'basic',
          'media_upload' => 1,
          'delay' => 0,
        ],
        [
          'key' => 'field_5cb5c614a0b8d',
          'label' => __('Helpful links when failing the quiz', 'dp'),
          'name' => 'complete_fail_links',
          'type' => 'repeater',
          'instructions' => '',
          'required' => 0,
          'conditional_logic' => 0,
          'wrapper' => [
            'width' => '',
            'class' => '',
            'id' => '',
          ],
          'collapsed' => 'field_5cb5c633a0b8e',
          'min' => 0,
          'max' => 5,
          'layout' => 'table',
          'button_label' => __('Add link', 'dp'),
          'sub_fields' => [
            [
              'key' => 'field_5cb5c633a0b8e',
              'label' => 'Link',
              'name' => 'link',
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
              'key' => 'field_5cb5c641a0b8f',
              'label' => __('Link text', 'dp'),
              'name' => 'link_text',
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
          ],
        ],
      ],
      'location' => [
        [
          [
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'quiz',
          ],
        ],
      ],
      'menu_order' => 0,
      'position' => 'normal',
      'style' => 'seamless',
      'label_placement' => 'top',
      'instruction_placement' => 'label',
      'hide_on_screen' => '',
      'active' => true,
      'description' => '',
    ]);
  }



  public static function inject_toggle_single_choice_checkbox_script() {
    wp_enqueue_script("simplicity-toggle-single-choice-checkbox", DP_PLUGIN_URL . "/assets/js/toggle_single_choice_checkbox.js", ["jquery"], false, true);
  }

  /**
   * filter quiz contents
   *
   * @param   array  $quiz  quiz custom field value
   *
   * @return  array         filtered quiz contents
   */
  public static function filter_quiz($quiz) {
    $result = [];

    if (!is_null($quiz)) {
      foreach ($quiz as $question) {
        $result[] = [
          "type" => $question["type"],
          "title" => $question["title"],
          "image" => $question["image"] ? wp_get_attachment_image_url($question["image"], "large") : null,
          "values" => apply_filters("dp/filter_quiz_values/{$question['type']}", $question[$question["type"]]),
          "incorrect_message" => $question["incorrect_message"],
        ];
      }
    }

    return $result;
  }

  /**
   * filter quiz value: assign
   *
   * @param   array  $values  values of type "assign"
   *
   * @return  array           filtered values
   */
  public static function filter_quiz_assign($values) {
    $result = [];

    foreach ($values as $item) {
      $result[] = [
        "term" => $item["term"],
        "assigned" => $item["assigned"],
      ];
    }

    return $result;
  }

  /**
   * filter quiz values: order
   *
   * @param   array  $values  values of type "order"
   *
   * @return  array           filtered values
   */
  public static function filter_quiz_order($values) {
    return array_column($values, "item");
  }
}

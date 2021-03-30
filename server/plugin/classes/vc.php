<?php

namespace Simplicity;

final class VC {
  public static function init() {
    add_action("plugins_loaded", __CLASS__ . "::setup_hooks");
  }

  public static function setup_hooks() {
    if(!function_exists("vc_add_shortcode_param")) return;

    // visual composer
    add_action("after_setup_theme", __CLASS__ . "::setup_vc");
    add_action("init", __CLASS__ . "::load_vc_elements", 11);
    add_action("init", __CLASS__ . "::add_vc_shortcode_params");

    add_filter("the_content", __CLASS__ . "::add_vc_custom_css", 999, 2);
    add_filter("the_content", __CLASS__ . "::remove_vc_classes", 999);

    // register vc shortcodes before indexing posts in relevanssi
    add_filter("relevanssi_content_to_index", __CLASS__ . "::add_shortcodes_to_relevanssi", 10, 2);

    // include article callback
    add_filter("vc_autocomplete_dp_include_learning_article_id_callback", __CLASS__ . "::include_learning_article_callback");
    add_filter("vc_autocomplete_dp_include_learning_article_id_render", __CLASS__ . "::include_article_render");
    add_filter("vc_autocomplete_dp_include_knowledge_article_id_callback", __CLASS__ . "::include_knowledge_article_callback");
    add_filter("vc_autocomplete_dp_include_knowledge_article_id_render", __CLASS__ . "::include_article_render");
  }

  /**
   * autocomplete
   * find learning articles
   *
   * @param   string  $query  query
   *
   * @return  array           results
   */
  public static function include_learning_article_callback($query) {
    global $wpdb;

    $q = $wpdb->get_results(
      $wpdb->prepare(
        "SELECT
          ID, post_title
        FROM $wpdb->posts
        WHERE post_status = 'publish'
          AND post_type = 'learning'
          AND post_title LIKE '%%%s%%'",
        $query
      ),
      OBJECT
    );

    $topics = get_terms("learning_topic", [
      "hide_empty" => true,
      "orderby" => "term_id",
      "fields" => "id=>name",
      "parent" => 0,
    ]);

    $result = [];
    foreach($q as $post) {
      // get module
      $module = get_the_terms($post->ID, "learning_topic")[0];

      // result
      $result[] = [
        "label" => $post->post_title,
        "value" => $post->ID,
        "group" => "{$topics[$module->parent]} / {$module->name}",
      ];
    }

    return $result;
  }

  /**
   * autocomplete
   * find knowledge articles
   *
   * @param   string  $query  query
   *
   * @return  array           results
   */
  public static function include_knowledge_article_callback($query) {
    global $wpdb;

    $q = $wpdb->get_results(
      $wpdb->prepare(
        "SELECT
          ID, post_title
        FROM $wpdb->posts
        WHERE post_status = 'publish'
          AND post_type = 'knowledge'
          AND post_title LIKE '%%%s%%'",
        $query
      ),
      OBJECT
    );

    $categories = get_terms("knowledge_category", [
      "hide_empty" => true,
      "orderby" => "term_id",
      "fields" => "id=>name",
      "parent" => 0,
    ]);

    $result = [];
    foreach($q as $post) {
      // get subcategory
      $subcategory = get_the_terms($post->ID, "knowledge_category")[0];

      // result
      $result[] = [
        "label" => $post->post_title,
        "value" => $post->ID,
        "group" => "{$categories[$subcategory->parent]} / {$subcategory->name}",
      ];
    }

    return $result;
  }

  /**
   * autocomplete
   * display result
   *
   * @param   array  $selected  array with value
   *
   * @return  array             label and value of post for autocomplete
   */
  public static function include_article_render($selected) {
    $post = get_post($selected["value"]);

    return [
      "label" => $post->post_title,
      "value" => $post->ID,
    ];
  }

  public static function add_vc_shortcode_params() {
    vc_add_shortcode_param("attach_video", __CLASS__ . "::attach_video_callback", DP_PLUGIN_URL . "assets/js/attach_video.js");
    vc_add_shortcode_param("file_picker", __CLASS__ . "::file_picker_settings_field", DP_PLUGIN_URL . "assets/js/file_picker.js");
  }

  public static function attach_video_callback($settings, $value) {
    return '<div class="vc_attach_video">
      <input style="width: 70%; float:left;" disabled="disabled" name="' . esc_attr( $settings['param_name'] ) . '" class="wpb_vc_param_value wpb-textinput ' .
             esc_attr( $settings['param_name'] ) . ' ' .
             esc_attr( $settings['type'] ) . '_field" type="text"value="' . esc_attr($value) . '">
      <button style="width: 30%; padding-top: 4px; padding-bottom: 4px; height: 36px;" class="vc_general vc_ui-button vc_ui-button-action vc_ui-button-shape-rounded vc_ui-button-fw attach_video_button" data-uploader-title="' . __("Attach video", "dp") . '">' . __("Attach video", "dp") . '</button>
    </div>';
  }

  public static function file_picker_settings_field( $settings, $value ) {
    $output = '';
    $select_file_class = '';
    $remove_file_class = ' hidden';
    $attachment_url = wp_get_attachment_url( $value );
    if ( $attachment_url ) {
      $select_file_class = ' hidden';
      $remove_file_class = '';
    }
    $output .= '<div class="file_picker_block">
                  <div class="' . esc_attr( $settings['type'] ) . '_display">' .
                    $attachment_url .
                  '</div>
                  <input type="hidden" name="' . esc_attr( $settings['param_name'] ) . '" class="wpb_vc_param_value wpb-textinput ' .
                  esc_attr( $settings['param_name'] ) . ' ' .
                  esc_attr( $settings['type'] ) . '_field" value="' . esc_attr( $value ) . '" />
                  <button class="button file-picker-button' . $select_file_class . '">Select File</button>
                  <button class="button file-remover-button' . $remove_file_class . '">Remove File</button>
                </div>
                ';
    return $output;
  }

  /**
   * add visual composer shortcodes to relevanssi index
   *
   * @param   string  $appended_content  appended content
   * @param   object  $post              the post
   *
   * @return  string                     new appended content (ignored)
   */
  public static function add_shortcodes_to_relevanssi($appended_content, $post) {
    \WPBMap::addAllMappedShortcodes();

    return $appended_content;
  }

  /**
   * Loads vc elements
   */
  public static function load_vc_elements() {
    require_once(DP_PLUGIN_VC_DIR . "accordion.php");
    require_once(DP_PLUGIN_VC_DIR . "alert.php");
    require_once(DP_PLUGIN_VC_DIR . "info.php");
    require_once(DP_PLUGIN_VC_DIR . "tip.php");
    require_once(DP_PLUGIN_VC_DIR . "button.php");
    require_once(DP_PLUGIN_VC_DIR . "divider.php");
    require_once(DP_PLUGIN_VC_DIR . "downloads.php");
    require_once(DP_PLUGIN_VC_DIR . "gallery.php");
    require_once(DP_PLUGIN_VC_DIR . "hero.php");
    require_once(DP_PLUGIN_VC_DIR . "image.php");
    require_once(DP_PLUGIN_VC_DIR . "image_text.php");
    require_once(DP_PLUGIN_VC_DIR . "list.php");
    require_once(DP_PLUGIN_VC_DIR . "list_wysiwyg.php");
    require_once(DP_PLUGIN_VC_DIR . "quote.php");
    require_once(DP_PLUGIN_VC_DIR . "steps.php");
    require_once(DP_PLUGIN_VC_DIR . "steps_image.php");
    require_once(DP_PLUGIN_VC_DIR . "table.php");
    require_once(DP_PLUGIN_VC_DIR . "table_50_50.php");
    require_once(DP_PLUGIN_VC_DIR . "table_33_33_33.php");
    require_once(DP_PLUGIN_VC_DIR . "table_30_30_20_20.php");
    require_once(DP_PLUGIN_VC_DIR . "table_25_25_25_25.php");
    require_once(DP_PLUGIN_VC_DIR . "video.php");
    require_once(DP_PLUGIN_VC_DIR . "include-learning-article.php");
    require_once(DP_PLUGIN_VC_DIR . "include-knowledge-article.php");
  }

  /**
   * setup visual composer
   */
  public static function setup_vc() {
    if(!function_exists("vc_set_default_editor_post_types"))
      return;

    vc_set_default_editor_post_types(["page", "knowledge", "learning"]);
    vc_set_shortcodes_templates_dir(get_stylesheet_directory() . "/templates/vc");
    vc_disable_frontend();

    vc_remove_element("vc_wp_calendar");
    vc_remove_element("vc_wp_search");
    vc_remove_element("vc_wp_meta");
    vc_remove_element("vc_wp_recentcomments");
    vc_remove_element("vc_wp_pages");
    vc_remove_element("vc_wp_tagcloud");
    vc_remove_element("vc_wp_custommenu");
    vc_remove_element("vc_wp_text");
    vc_remove_element("vc_wp_posts");
    vc_remove_element("vc_wp_categories");
    vc_remove_element("vc_wp_archives");
    vc_remove_element("vc_wp_rss");
    vc_remove_element("vc_icon");
    vc_remove_element("vc_separator");
    vc_remove_element("vc_zigzag");
    vc_remove_element("vc_text_separator");
    vc_remove_element("vc_message");
    vc_remove_element("vc_hoverbox");
    vc_remove_element("vc_facebook");
    vc_remove_element("vc_tweetmeme");
    vc_remove_element("vc_googleplus");
    vc_remove_element("vc_pinterest");
    vc_remove_element("vc_toggle");
    vc_remove_element("vc_images_carousel");
    vc_remove_element("vc_tta_tabs");
    vc_remove_element("vc_tta_tour");
    vc_remove_element("vc_tta_pageable");
    vc_remove_element("vc_custom_heading");
    vc_remove_element("vc_widget_sidebar");
    vc_remove_element("vc_posts_slider");
    vc_remove_element("vc_gmaps");
    vc_remove_element("vc_flickr");
    vc_remove_element("vc_progress_bar");
    vc_remove_element("vc_pie");
    vc_remove_element("vc_round_chart");
    vc_remove_element("vc_line_chart");
    vc_remove_element("vc_empty_space");
    vc_remove_element("vc_basic_grid");
    vc_remove_element("vc_media_grid");
    vc_remove_element("vc_masonry_grid");
    vc_remove_element("vc_masonry_media_grid");
    vc_remove_element("vc_acf");
    vc_remove_element("vc_section");
    vc_remove_element("vc_tabs");
    vc_remove_element("vc_tour");
    vc_remove_element("vc_accordion");
    vc_remove_element("vc_btn");
    vc_remove_element("vc_gallery");
    vc_remove_element("vc_single_img");
    vc_remove_element("vc_single_image");
    vc_remove_element("vc_cta");
    vc_remove_element("vc_raw_html");
    vc_remove_element("vc_raw_js");
    vc_remove_element("vc_gutenberg");
  }

  /**
   * Adds visual composer custom css to the top of content
   *
   * @param      string  $content  The content
   * @param      int     $id       The identifier
   *
   * @return     string  filtered content
   */
  public static function add_vc_custom_css($content, $id = null) {
    if($id === null) return $content;

    $custom_css = "";
    $shortcodes_custom_css = get_post_meta($id, "_wpb_shortcodes_custom_css", true);
    $post_custom_css = get_post_meta($id, "_wpb_post_custom_css", true);

    if(!empty($shortcodes_custom_css)) $custom_css.= $shortcodes_custom_css;
    if(!empty($post_custom_css)) $custom_css.= $post_custom_css;

    if(!empty($custom_css)) {
      return '<style type="text/css">' . $custom_css . '</style>' . $content;
    } else {
      return $content;
    }
  }

  /**
   * Removes visual composer prefixed classes in output
   *
   * @param      string  $content  The content
   *
   * @return     string  filtered content
   */
  public static function remove_vc_classes($content) {
    $content = preg_replace("/vc_(?!custom)+/i", "$1", $content);
    $content = preg_replace("/wpb_(row|column)/i", "", $content);
    $content = preg_replace("/wpb_(\w+)/i", "$1", $content);
    $content = preg_replace("/(\s)+\">/i", "\">", $content);
    $content = preg_replace("/\"(\s)+>/i", "\">", $content);

    return $content;
  }
}

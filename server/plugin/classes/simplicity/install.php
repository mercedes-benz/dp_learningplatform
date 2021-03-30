<?php

namespace Simplicity;

final class Install {
  public static function init() {
    self::setup_pages();
    self::setup_default_tags();
    self::create_reading_progress();
    self::create_bookmarks();
    self::create_likes();
    self::create_completed_modules();
    self::create_completed_topics();
    self::flush_rewrite_rules();
  }

  /**
   * setup pages
   */
  private static function setup_pages() {
    $pages = [
      "Startseite" => 1,
      "Kontakt" => 0,
      "Simplicity" => 1,
      "Lernen" => 1,
      "Wissen" => 1,
      "Login" => 0,
      "Login successful" => 1,
    ];

    foreach ($pages as $page => $auth_required) {
      // check if page already exists
      $page_exists = get_posts(
        [
          "post_type" => "page",
          "name" => sanitize_title_with_dashes($page),
          "numberposts" => 1,
        ]
      );

      // continue if page exists
      if (!empty($page_exists)) {
        continue;
      }

      $page_args = [
        "post_title" => $page,
        "post_name" => sanitize_title_with_dashes($page),
        "post_content" => '[vc_row][vc_column width="1/1"][vc_column_text]<h1>' . $page . '</h1><p>Fusce facilisis felis ut purus fermentum lacinia. Nullam cursus non.</p>[/vc_column_text][/vc_column][/vc_row]',
        "post_status" => "publish",
        "post_type" => "page",
        "post_author" => 1,
        "post_category" => [],
        "meta_input" => [
          "auth_required" => $auth_required,
          "_auth_required" => "field_5b7195978eae1", // as defined in Plugin::register_acf()
        ],
      ];

      // insert the page
      wp_insert_post($page_args);
    }
  }

  /**
   * setup default tags for knowledge and learning
   */
  public static function setup_default_tags() {
    $option = is_array($options_arr = get_option("dps_option")) ? $options_arr : [];

    if (!isset($option["knowledge_tags"]) || empty($option["knowledge_tags"]) || empty($option["knowledge_tags"][0])) {
      $option["knowledge_tags"] = ["Allgemein"];
    }
    $option = is_array($options_arr = get_option("dps_options")) ? $options_arr : [];

    if (!isset($option["learning_tags"]) || empty($option["learning_tags"]) || empty($option["learning_tags"][0])) {
      $option["learning_tags"] = ["Allgemein"];
    }

    update_option("dps_options", $option);
  }

  /**
   * creates reading_progress table
   */
  public static function create_reading_progress() {
    global $wpdb;

    $table_name = $wpdb->prefix . "reading_progress";
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE {$table_name} (
      read_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      module_id BIGINT(20) UNSIGNED,
      article_id BIGINT(20) UNSIGNED,
      user_id BIGINT(20) UNSIGNED,
      read_date DATETIME DEFAULT '0000-00-00 00:00:00' NOT NULL,

      PRIMARY KEY (read_id),
      INDEX (module_id),
      INDEX (article_id),
      INDEX (user_id),

      FOREIGN KEY (module_id)
        REFERENCES {$wpdb->terms}(term_id)
        ON DELETE SET NULL,

      FOREIGN KEY (article_id)
        REFERENCES {$wpdb->posts}(ID)
        ON DELETE SET NULL,

      FOREIGN KEY (user_id)
        REFERENCES {$wpdb->users}(ID)
        ON DELETE SET NULL
    ) {$charset_collate};";

    require_once(ABSPATH . "wp-admin/includes/upgrade.php");

    dbDelta($sql);
  }

  /**
   * creates bookmarks table
   */
  public static function create_bookmarks() {
    global $wpdb;

    $table_name = $wpdb->prefix . "bookmarks";
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
      bookmark_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      article_id BIGINT(20) UNSIGNED,
      user_id BIGINT(20) UNSIGNED,
      lang VARCHAR(10) DEFAULT 'de',
      inserted_at DATETIME DEFAULT '0000-00-00 00:00:00' NOT NULL,

      PRIMARY KEY (bookmark_id),
      INDEX (article_id, user_id),
      UNIQUE KEY(article_id, user_id),

      FOREIGN KEY (article_id)
        REFERENCES {$wpdb->posts}(ID)
        ON DELETE CASCADE,

      FOREIGN KEY (user_id)
        REFERENCES {$wpdb->users}(ID)
        ON DELETE CASCADE
    ) {$charset_collate};";

    require_once(ABSPATH . "wp-admin/includes/upgrade.php");

    dbDelta($sql);
  }

  /**
   * create likes table
   */
  public static function create_likes() {
    global $wpdb;

    $table_name = $wpdb->prefix . "likes";
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
      like_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      article_id BIGINT(20) UNSIGNED,
      user_id BIGINT(20) UNSIGNED,
      inserted_at DATETIME DEFAULT '0000-00-00 00:00:00' NOT NULL,

      PRIMARY KEY (like_id),
      INDEX (article_id, user_id),
      UNIQUE KEY(article_id, user_id),

      FOREIGN KEY (article_id)
        REFERENCES {$wpdb->posts}(ID)
        ON DELETE CASCADE,

      FOREIGN KEY (user_id)
        REFERENCES {$wpdb->users}(ID)
        ON DELETE CASCADE
    ) {$charset_collate};";

    require_once(ABSPATH . "wp-admin/includes/upgrade.php");

    dbDelta($sql);
  }

  /**
   * create completed modules table
   */
  public static function create_completed_modules() {
    global $wpdb;

    $table_name = $wpdb->prefix . "completed_modules";
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
      completed_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      module_id BIGINT(20) UNSIGNED,
      user_id BIGINT(20) UNSIGNED,
      completed_date DATETIME DEFAULT '0000-00-00 00:00:00' NOT NULL,

      PRIMARY KEY(completed_id),
      INDEX(module_id),
      INDEX(user_id),

      FOREIGN KEY (module_id)
        REFERENCES {$wpdb->terms}(term_id)
        ON DELETE SET NULL,

      FOREIGN KEY (user_id)
        REFERENCES {$wpdb->users}(ID)
        ON DELETE CASCADE
    )";

    require_once(ABSPATH . "wp-admin/includes/upgrade.php");

    dbDelta($sql);
  }

  /**
   * create completed topics table
   */
  public static function create_completed_topics() {
    global $wpdb;

    $table_name = $wpdb->prefix . "completed_topics";
    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE IF NOT EXISTS {$table_name} (
      completed_id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
      topic_id BIGINT(20) UNSIGNED,
      user_id BIGINT(20) UNSIGNED,
      completed_date DATETIME DEFAULT '0000-00-00 00:00:00' NOT NULL,

      PRIMARY KEY(completed_id),
      INDEX(topic_id),
      INDEX(user_id),

      FOREIGN KEY (topic_id)
        REFERENCES {$wpdb->terms}(term_id)
        ON DELETE SET NULL,

      FOREIGN KEY (user_id)
        REFERENCES {$wpdb->users}(ID)
        ON DELETE CASCADE
    ) {$charset_collate};";

    require_once(ABSPATH . "wp-admin/includes/upgrade.php");

    dbDelta($sql);
  }

  /**
   * flush rewrite rules
   */
  public static function flush_rewrite_rules() {
    flush_rewrite_rules();
  }
}

<?php

namespace Simplicity;

final class Migrations {
  private static $versions = [];

  public static function init() {
    add_action("plugins_loaded", __CLASS__ . "::register_migrations");
    add_action("dp/prepare_migrations", __CLASS__ . "::prepare_migrations", 10, 3);
  }

  /**
   * register migrations
   *
   * @return  void
   */
  public static function register_migrations() {
    // the migrate action gets called on "plugins_loaded"
    // however acf fields get registered on action "after_setup_theme" with priority 99
    // so we need to hook on "after_setup_theme" with priority 100
    // to update fields correctly, otherwise they aren't available at that point
    //
    // @2.3.0 - action "dp/run_migration" has been added to migrate by api
    // @2.4.0 - added migration queue

    // v2.5.6
    self::register_migration("2.5.6", function() {
      add_action("init", __CLASS__ . "::migrate_2_5_6", 100);
      add_action("dp/run_migration", __CLASS__ . "::migrate_2_5_6");
    });

    // v2.4.0
    self::register_migration("2.4.0", function() {
      add_action("init", __CLASS__ . "::migrate_2_4_0", 100);
      add_action("dp/run_migration", __CLASS__ . "::migrate_2_4_0");
    });

    // v2.3.0
    self::register_migration("2.3.0", function() {
      add_action("init", __CLASS__ . "::migrate_2_3_0", 100);
      add_action("dp/run_migration", __CLASS__ . "::migrate_2_3_0");
    });

    // v1.4.2
    self::register_migration("1.4.2", function() {
      add_action("init", __CLASS__ . "::migrate_1_4_2", 100);
    });

    // v1.4.1
    self::register_migration("1.4.1", function() {
      add_action("init", __CLASS__ . "::migrate_1_4_1", 100);
    });

    // v1.3.3
    self::register_migration("1.3.3", function() {
      add_action("init", __CLASS__ . "::migrate_1_3_3", 100);
    });

    // v1.3.2
    self::register_migration("1.3.2", function() {
      add_action("init", __CLASS__ . "::migrate_1_3_2", 100); // affects taxonomy which gets initiated at action 'init'
    });

    // v1.3.1
    self::register_migration("1.3.1", function() {
      add_action("init", __CLASS__ . "::migrate_1_3_1", 100); // affects taxonomy which gets initiated at action 'init'
    });

    // v1.3.0
    self::register_migration("1.3.0", function() {
      add_action("after_setup_theme", __CLASS__ . "::migrate_1_3_0", 100);
    });

    // v1.2.1
    self::register_migration("1.2.1", function () {
      add_action("after_setup_theme", __CLASS__ . "::migrate_1_2_1", 100);
    });

    // v1.2.0
    self::register_migration("1.2.0", function () {
      add_action("after_setup_theme", __CLASS__ . "::migrate_1_2_0", 100);
    });

    // v1.1.0
    self::register_migration("1.1.0", function () {
      add_action("after_setup_theme", __CLASS__ . "::migrate_1_1_0", 100);
    });

    // v1.0.2
    self::register_migration("1.0.2", function () {
      add_action("after_setup_theme", __CLASS__ . "::migrate_1_0_2", 100);
    });

    // v1.0.1
    self::register_migration("1.0.1", function () {
      add_action("after_setup_theme", __CLASS__ . "::migrate_1_0_1", 100);
    });
  }

  /**
   * Migrate for v2.5.6
   * -------
   * - fixes 'completed topics' calculation (group access was not considered)
   */
  public static function migrate_2_5_6() {
    global $wpdb;

    // get all topics with modules (not empty)
    $sql = "
      SELECT
        parent as topic,
        GROUP_CONCAT(term_id) as modules
      FROM
        {$wpdb->term_taxonomy}
      WHERE
        count > 0 AND taxonomy = 'learning_topic'
      GROUP BY
        parent
    ";

    $topics = $wpdb->get_results($sql, OBJECT);

    // get all users with progress
    $sql = "
      SELECT
        distinct user_id
      FROM
        {$wpdb->prefix}completed_modules
      WHERE
        user_id IS NOT NULL
    ";

    $users = $wpdb->get_col($sql);

    // for each topic cycle through all users with progress.
    // get excluded categories and check if all modules have been completed.
    // if so, create completed topics entry if it does not exist already.
    foreach($topics as $topic) {
      $all_modules = explode(",", $topic->modules);

      foreach($users as $user) {
        $modules = array_diff($all_modules, Helper::get_forbidden_learning_categories($user));
        $num_modules = count($modules);
        $joined_modules = join(",", $modules);

        $sql = "
          SELECT
            COUNT(distinct module_id, user_id) >= {$num_modules} as completed
          FROM
            {$wpdb->prefix}completed_modules
          WHERE
            user_id = {$user}
            AND module_id in ({$joined_modules})
        ";

        $completed = $wpdb->get_var($sql);
        $current_time = current_time("mysql");

        if(filter_var($completed, FILTER_VALIDATE_BOOLEAN)) {
          // insert completed topic data if data does not already exist
          $sql = "
            INSERT INTO {$wpdb->prefix}completed_topics (topic_id, user_id, completed_date)
            SELECT %d AS tid, %d AS uid, '%s' AS d
            WHERE NOT EXISTS (
              SELECT topic_id, user_id FROM {$wpdb->prefix}completed_topics WHERE topic_id = %d AND user_id = %d
            ) LIMIT 1;
          ";

          $wpdb->query(
            $wpdb->prepare($sql, $topic->topic, $user, $current_time, $topic->topic, $user)
          );
        }
      }
    }
  }

  /**
   * Migrate for v2.4.0
   * -------
   * - Migrate post meta `is_quiz` to `article_type` with value `quiz`
   */
  public static function migrate_2_4_0() {
    global $wpdb;

    // replace is_quiz: 1 with article_type: quiz
    $wpdb->update(
      $wpdb->postmeta,
      [
        "meta_key" => "article_type",
        "meta_value" => "quiz"
      ],
      [
        "meta_key" => "is_quiz",
        "meta_value" => 1,
      ],
      ["%s", "%s"],
      ["%s", "%d"]
    );

    // replace is_quiz: 0 with article_type: article
    $wpdb->update(
      $wpdb->postmeta,
      [
        "meta_key" => "article_type",
        "meta_value" => "article"
      ],
      [
        "meta_key" => "is_quiz",
        "meta_value" => 0,
      ],
      ["%s", "%s"],
      ["%s", "%d"]
    );

    // replace is_quiz: 0 with article_type: article
    $wpdb->update(
      $wpdb->postmeta,
      [
        "meta_key" => "_article_type",
        "meta_value" => "field_5e44ebacd475d"
      ],
      [
        "meta_key" => "_is_quiz",
      ],
      ["%s", "%s"],
      ["%s"]
    );
  }

  /**
   * Migrate for v2.3.0
   * -------
   * - Add completed topics
   * - Add data to completed topics by completed modules
   */
  public static function migrate_2_3_0() {
    self::migrate_2_3_0_completed_topics_table();
    self::migrate_2_3_0_completed_topics_data();
  }

  private static function migrate_2_3_0_completed_topics_table() {
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

  private static function migrate_2_3_0_completed_topics_data() {
    global $wpdb;

    $sql = "
      SELECT
        parent as topic,
        GROUP_CONCAT(term_id) as modules
      FROM
        {$wpdb->term_taxonomy}
      WHERE
        count > 0 AND taxonomy = 'learning_topic'
      GROUP BY
        parent
    ";

    $results = $wpdb->get_results($sql, OBJECT);

    foreach($results as $result) {
      if(!empty($result->modules)) {
        $count = count(explode(",", $result->modules));

        $sql = "
        SELECT
          user_id,
          count(distinct module_id, user_id) = {$count} as completed
        FROM
          {$wpdb->prefix}completed_modules
        WHERE
          module_id in ({$result->modules})
        GROUP BY
          user_id
        ";

        $completed = $wpdb->get_results($sql, OBJECT);

        foreach($completed as $c) {
          if((int)$c->completed === 1) {
            $wpdb->insert(
              "{$wpdb->prefix}completed_topics",
              [
                "topic_id" => $result->topic,
                "user_id" => $c->user_id,
                "completed_date" => current_time("mysql"),
              ]
            );
          }
        }
      }
    }
  }

  /**
   * Migrate for v1.4.2
   * -------
   * - Add completed modules
   * - Add data to completed modules by reading progress
   */
  public static function migrate_1_4_2() {
    self::migrate_1_4_2_completed_modules_table();
    self::migrate_1_4_2_completed_modules_data();
  }

  private static function migrate_1_4_2_completed_modules_table() {
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

  private static function migrate_1_4_2_completed_modules_data() {
    global $wpdb;

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
      WHERE
        rp.article_id IS NOT NULL
      GROUP BY
        rp.module_id, rp.user_id
    ";

    $results = $wpdb->get_results($sql, OBJECT);

    foreach($results as $result) {
      if($result->read_articles >= $result->existing_articles) {
        $wpdb->insert(
          "{$wpdb->prefix}completed_modules",
          [
            "module_id" => $result->module_id,
            "user_id" => $result->user_id,
            "completed_date" => current_time("mysql"),
          ]
        );
      }
    }
  }

  /**
   * Migrate for v1.4.1
   * -------
   * - Add likes
   *
   * @return void
   */
  public static function migrate_1_4_1() {
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
   * Migrate for v1.3.3
   * -------
   * - Add bookmarks
   *
   * @return void
   */
  public static function migrate_1_3_3() {
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
   * Migrate for v1.3.2
   * -------
   * - Reset learning tags in options
   * - Set default learning_tag of all learning_topics
   * - Removes learning_tag from learning articles
   *
   * @return void
   */
  public static function migrate_1_3_2() {
    global $wpdb;

    // run 1.3.1 migration
    self::migrate_1_3_1();

    // override learning tags
    if ($option = get_option("dps_options")) {
      $option["learning_tags"] = ["Allgemein"];
      update_option("dps_options", $option);
    }

    // set default difficulty for learning_topics
    $terms = get_terms([
      "hide_empty" => false,
      "childless" => true,
      "taxonomy" => "learning_topic",
    ]);

    foreach($terms as $term) {
      update_field("learning_tag", "Allgemein", $term);
    }

    // remove learning_tags from learning articles post meta
    $wpdb->delete($wpdb->postmeta, ["meta_key" => "learning_tag"], ["%s"]);
    $wpdb->delete($wpdb->postmeta, ["meta_key" => "_learning_tag"], ["%s"]);
  }

  /**
   * Migrate for v1.3.1
   * -------
   * - Set default custom field "difficulty" for all terms in learning_topic
   * - Create new default pages for "Wissen" and "Lernen"
   *
   * @return void
   */
  public static function migrate_1_3_1() {
    // run 1.3.0 migration
    self::migrate_1_3_0();

    // set default difficulty for learning_topics
    $terms = get_terms([
      "hide_empty" => false,
      "taxonomy" => "learning_topic",
    ]);

    foreach($terms as $term) {
      update_field("difficulty", "Beginner", $term);
    }

    // install default pages if they don't exist
    $pages = [
      "Simplicity" => 1,
      "Lernen" => 1,
      "Wissen" => 1,
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
   * Migrate for v1.3.0
   * -------
   * - Creates reading progress table
   *
   * @return void
   */
  public static function migrate_1_3_0() {
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
   * Migrate for v1.2.1
   * -------
   * - Renames meta key "number" to "order"
   * - Renames taxonomy knowledge_topic to knowledge_category
   *
   * @return void
   */
  public static function migrate_1_2_1() {
    global $wpdb;

    // run migration for 1.2.0
    self::migrate_1_2_0();

    // rename knowledge_topic to knowledge_category
    $wpdb->update($wpdb->term_taxonomy, ["taxonomy" => "knowledge_category"], ["taxonomy" => "knowledge_topic"], ["%s"], ["%s"]);

    // rename number to order
    $wpdb->update($wpdb->postmeta, ["meta_key" => "order"], ["meta_key" => "number"], ["%s"], ["%s"]);
    $wpdb->update($wpdb->postmeta, ["meta_key" => "_order"], ["meta_key" => "_number"], ["%s"], ["%s"]);
    $wpdb->update($wpdb->termmeta, ["meta_key" => "order"], ["meta_key" => "number"], ["%s"], ["%s"]);
    $wpdb->update($wpdb->termmeta, ["meta_key" => "_order"], ["meta_key" => "_number"], ["%s"], ["%s"]);
  }

  /**
   * Migrate for v1.2.0
   * -------
   * - Adds default tag to "learning_tags" in options
   *
   * @return void
   */
  public static function migrate_1_2_0() {
    if ($option = get_option("dps_options")) {
      if (!isset($option["learning_tags"])) {
        $option["learning_tags"] = ["Allgemein"];
        update_option("dps_options", $option);
      }
    }
  }

  /**
   * Migrate for v1.1.0
   * -------
   * - Renames CPT "releases" to "knowledge"
   * - Renames "categories" to "topics" (also affects custom taxonomy "release_category")
   * - Renames "linked_releases" to "linked_knowledge_articles"
   * - Renames option "releases_tags" to "knowledge_tags"
   *
   * @return void
   */
  public static function migrate_1_1_0() {
    global $wpdb;

    // rename releases to knowledge
    $wpdb->update($wpdb->posts, ["post_type" => "knowledge"], ["post_type" => "releases"], ["%s"], ["%s"]);

    // rename release_category to knowledge_topic
    $wpdb->update($wpdb->term_taxonomy, ["taxonomy" => "knowledge_topic"], ["taxonomy" => "release_category"], ["%s"], ["%s"]);

    // rename linked_releases to linked_knowledge_articles
    $wpdb->update($wpdb->postmeta, ["meta_key" => "linked_knowledge_articles"], ["meta_key" => "linked_releases"], ["%s"], ["%s"]);
    $wpdb->update($wpdb->postmeta, ["meta_key" => "_linked_knowledge_articles"], ["meta_key" => "_linked_releases"], ["%s"], ["%s"]);

    // rename option releases_tags to knowledge_tags
    if ($option = get_option("dps_options")) {
      if (!isset($option["knowledge_tags"])) {
        $option["knowledge_tags"] = $option["releases_tags"];
        unset($option["releases_tags"]);
        update_option("dps_options", $option);
      }
    }
  }

  /**
   * Migration for v1.0.2
   * -------
   * - Creates a dummy page for successful logins
   * - Adds default tag for releases and extends the dp option
   *
   * @return void
   */
  public static function migrate_1_0_2() {
    self::migrate_1_0_2_tags();
    self::migrate_1_0_2_add_login_successful_page();
  }

  /**
   * v1.0.2: Adds default tag for releases and extends the dp option
   */
  public static function migrate_1_0_2_tags() {
    $default_tag = "Standard";

    // extend option
    $option = Helper::get_option();

    if (!isset($option["releases_tags"]) || empty($option["releases_tags"])) {
      $option["releases_tags"] = [];
    }

    $sanitized_tag = sanitize_key($default_tag);
    $option["releases_tags"][$sanitized_tag] = $default_tag;

    Helper::update_option($option);

    // update posts
    $posts = get_posts([
      "post_type" => "releases",
      "numberposts" => -1,
      "fields" => "ids",
    ]);

    foreach ($posts as $post) {
      // set tag value
      if (get_field("tag", $post) === NULL) {
        update_field("tag", $sanitized_tag, $post);
      }
    }
  }

  /**
   * v1.0.2: Creates a dummy page for successful logins
   */
  public static function migrate_1_0_2_add_login_successful_page() {
    $page_name = "login-successful";

    // check if page already exists
    $page = get_posts([
      "post_type" => "page",
      "numberposts" => 1,
      "name" => $page_name,
    ]);

    if (!empty($page)) {
      return;
    }

    $page_args = [
      "post_title" => "Login erfolgreich",
      "post_name" => $page_name,
      "post_content" => '[vc_row][vc_column width="1/6"][/vc_column][vc_column width="2/3"][vc_column_text]<h1>Login erfolgreich</h1>Aliquam hendrerit dui et ultricies lobortis. Praesent volutpat metus id aliquam eleifend. Duis volutpat gravida eros non volutpat. Pellentesque nec dapibus nisl. Curabitur sit amet vestibulum nibh, ac porta odio. In venenatis nulla eros, id tempor magna accumsan quis. Vivamus posuere tortor est, vitae scelerisque diam posuere at. Pellentesque lobortis, ante at suscipit convallis, ligula libero faucibus leo, nec dictum dolor risus id diam. Phasellus mauris diam, interdum nec mollis non, efficitur et nisi. Ut lacinia euismod leo, sed facilisis turpis lacinia vitae. Ut maximus rhoncus est, sit amet tincidunt leo tempus sit amet. Morbi aliquet egestas facilisis. Maecenas sit amet eleifend mi. Aliquam sodales elit sed lacus vestibulum elementum. Cras eleifend ac turpis vitae luctus.[/vc_column_text][/vc_column][vc_column width="1/6"][/vc_column][/vc_row]',
      "post_status" => "publish",
      "post_type" => "page",
      "post_author" => 1,
      "post_category" => [],
    ];

    // insert the post
    wp_insert_post($page_args);
  }

  /**
   * Migration for v1.0.1
   * -------
   * Writes default values of the post meta fields
   * "reading_time", "views" and "number" if they not exist
   */
  public static function migrate_1_0_1() {
    $posts = get_posts([
      "post_type" => "releases",
      "numberposts" => -1,
      "fields" => "ids",
    ]);

    foreach ($posts as $post) {
      // initially set reading time
      if (get_field("reading_time", $post) === NULL) {
        update_field("reading_time", 0, $post);
      }

      // initially set views
      if (get_field("views", $post) === NULL) {
        update_field("views", 0, $post);
      }

      // initially set number
      if (get_field("number", $post) === NULL) {
        update_field("number", 0, $post);
      }
    }
  }

  /**
   * prepare migrations
   * -------
   * prepares all the migrations between the given version numbers
   *
   * @param   string  $from            version from
   * @param   string  $to              version to
   * @param   string  $recent_version  recent version
   *
   * @return  void
   */
  public static function prepare_migrations($from, $to, $recent_version) {
    // don't run migrations on fresh install
    // but set option "dp_last_migration" to last available migration
    if(!$from && !$recent_version) {
      update_option("dp_last_migration", end(array_reverse(self::$versions)));
      return;
    }

    // necessary since 2.5.X
    if(!$from) $from = "2.4.0";

    $migrations = self::get_migrations($from, $to);

    foreach($migrations as $version) {
      do_action("dp/migrate_version/{$version}");

      // update last migration
      if(!defined("DP_TEST_MIGRATION") || DP_TEST_MIGRATION !== true) {
        update_option("dp_last_migration", $version);
      }
    }
  }

  /**
   * get migrations between version numbers
   *
   * @param   string  $from  version from
   * @param   string  $to    version to
   *
   * @return  array          versions to migrate in reverse order
   */
  private static function get_migrations($from, $to) {
    $versions = array_reverse(self::$versions);

    $key_from = array_search($from, $versions);
    $key_to = array_search($to, $versions);

    // if key_to does not exist, use length of versions array (last item)
    if(!$key_to) $key_to = count($versions);

    return array_slice($versions, $key_from + 1, ($key_to - $key_from));
  }

  /**
   * register single migration
   *
   * @param   string    $version   version
   * @param   callable  $callback  action callback fun
   *
   * @return  void
   */
  private static function register_migration($version, $callback) {
    if(!array_key_exists($version, self::$versions)) {
      add_action("dp/migrate_version/{$version}", $callback);

      self::$versions[] = $version;
    }
  }
}

Migrations::init();

<?php

namespace Simplicity;

final class Helper {
  /**
   * @var string
   */
  private static $option_key = "dps_options";

  /**
   * active WPML languages
   *
   * @var  null|array
   */
  private static $languages = NULL;

  /**
   * forbidden categories
   *
   * @var  array
   */
  private static $forbidden_categories = [];

  /**
   * built-in user roles by wordpress
   * --------
   * if there are any 3rd party roles that have to stay,
   * also include them here
   * otherwise they will get removed
   * by \Simplicity\Plugin::inject_custom_user_roles()
   *
   * @var        array
   */
  public static $builtin_roles = ["administrator", "editor", "author", "subscriber", "contributor", "subscriber", "translator"];

  public static function is_debug_login() {
    return defined("DP_DEBUG_LOGIN") && DP_DEBUG_LOGIN;
  }

  /**
   * @param $new_value
   * @return null
   */
  public static function update_option($new_value) {
    if (!is_array($new_value)) {
      return;
    }

    update_option(self::$option_key, $new_value);
  }

  /**
   * Gets a key of options array
   *
   * @param      boolean  $key    The key
   *
   * @return     mixed   The option.
   */
  public static function get_option($key = false) {
    $option = get_option(self::$option_key);

    if (!$option) {
      return null;
    }

    if (!$key) {
      return $option;
    }

    if (isset($option[$key])) {
      return $option[$key];
    } else {
      return false;
    }
  }

  public static function get_forbidden_knowledge_categories($user_id = false, $suppress_wpml = false) {
    return self::get_forbidden_categories("knowledge_category", $user_id, $suppress_wpml);
  }

  public static function get_forbidden_learning_categories($user_id = false, $suppress_wpml = false) {
    return self::get_forbidden_categories("learning_topic", $user_id, $suppress_wpml);
  }

  /**
   * Gets the user roles.
   *
   * @return     array  The users roles.
   */
  public static function get_user_roles($user_id = false) {
    if(!$user_id || $user_id == 0) {
      $user_id = get_current_user_id();
    }

    $user_data = get_userdata($user_id);
    $user_roles = $user_data->roles;

    return $user_roles;
  }

  /**
   * Check if (some) user roles match with
   * roles in params
   *
   * @param      array    $roles  The roles
   *
   * @return     boolean
   */
  public static function do_user_roles_match($roles = [], $user_id = false) {
    $user_roles = self::get_user_roles($user_id);

    if (!is_array($roles)) {
      return false;
    }

    if (count(array_intersect($user_roles, $roles)) > 0) {
      return true;
    } else {
      return false;
    }

  }

  /**
   * Gets the custom user roles.
   *
   * @param      boolean  $only_keys  If only keys should be returned
   *
   * @return     array    The custom user roles.
   */
  public static function get_custom_user_roles($only_keys = true) {
    global $wp_roles;

    $roles = [];

    foreach ($wp_roles->role_names as $role_key => $role_name) {
      if (!in_array($role_key, self::$builtin_roles)) {
        if ($only_keys) {
          $roles[] = $role_key;
        } else {
          $roles[$role_key] = $role_name;
        }
      }
    }

    return $roles;
  }

  /**
   * @param $a
   * @param $b
   */
  public static function sort_by_number($a, $b) {
    return self::sort_by_meta_key("number", $a, $b);
  }

  /**
   * @param $a
   * @param $b
   */
  public static function sort_by_order($a, $b) {
    return self::sort_by_meta_key("order", $a, $b);
  }

  /**
   * Gets the tags.
   *
   * @return     array  The tags.
   */
  public static function get_knowledge_tags() {
    return self::get_tags("knowledge_tags");
  }

  public static function get_learning_tags() {
    return self::get_tags("learning_tags");
  }

  /**
   * get translated posts
   *
   * @param   int     $post_id    post id
   * @param   string  $post_type  post type
   *
   * @return  array               translated post IDs
   */
  public static function get_post_translations($post_id, $post_type) {
    $translations = [];
    $languages = self::get_active_languages();

    foreach($languages as $lang_code => $lang_data) {
      if($lang_code !== ICL_LANGUAGE_CODE) {
        $translations[$lang_code] = icl_object_id($post_id, $post_type, false, $lang_code);
      }
    }

    return $translations;
  }

  /**
   * get translated taxnomies
   *
   * @param   int     $term_id   term id
   * @param   string  $taxonomy  taxonomy type
   *
   * @return  array              translated taxonomy slugs
   */
  public static function get_taxonomy_translations($term_id, $taxonomy) {
    $translations = [];
    $languages = self::get_active_languages();

    // disable wpml term filters temporary
    global $sitepress;
    remove_filter('get_term', array($sitepress,'get_term_adjust_id'), 1, 1);

    foreach($languages as $lang_code => $lang_data) {
      if($lang_code !== ICL_LANGUAGE_CODE) {
        $id = icl_object_id($term_id, $taxonomy, false, $lang_code);
        $translations[$lang_code] = (!$id || in_array($id, self::get_forbidden_categories($taxonomy, false)) ? NULL : $id);
      }
    }

    // enable wpml term filters again
    add_filter('get_term', array($sitepress,'get_term_adjust_id'), 1, 1);

    return $translations;
  }

  /**
   * is article bookmarked
   *
   * @param   int  $article_id  article id
   *
   * @return  bool
   */
  public static function is_article_bookmarked($article_id) {
    $user = wp_get_current_user();

    global $wpdb;

    $query = $wpdb->get_col(
      $wpdb->prepare("SELECT bookmark_id FROM {$wpdb->prefix}bookmarks WHERE article_id = '%d' AND user_id = '%s' LIMIT 1;", $article_id, $user->ID)
    );

    return $query ? true : false;
  }

  /**
   * count likes
   *
   * @param   int  $article_id  article id
   * @param   int  $user_id     user id
   *
   * @return  array             result
   */
  public static function count_likes($article_id) {
    global $wpdb;

    $user = wp_get_current_user();

    $query_num_likes = "SELECT COUNT(like_id) FROM {$wpdb->prefix}likes WHERE article_id = '%d';";
    $num_likes = $wpdb->get_var($wpdb->prepare($query_num_likes, $article_id));

    $query_user_likes_article = "SELECT COUNT(like_id) FROM {$wpdb->prefix}likes WHERE article_id = '%d' AND user_id = '%d';";
    $user_likes_article = $wpdb->get_var($wpdb->prepare($query_user_likes_article, $article_id, $user->ID));

    return ["num_likes" => (int)$num_likes, "is_liked" => ($user_likes_article > 0)];
  }

  /**
   * sort by custom field "number"
   *
   * @param      object   $a      Object A
   * @param      object   $b      Object B
   *
   * @return     integer  comparison value
   */
  private static function sort_by_meta_key($meta_key, $a, $b) {
    // if array
    if (is_array($a)) {
      if (intval($a["fields"]->{$meta_key}) == intval($b["fields"]->{$meta_key})) {
        return 0;
      }

      return (intval($a["fields"]->{$meta_key}) < intval($b["fields"]->{$meta_key})) ? -1 : 1;

      // else object
    } else {
      if (intval($a->fields->{$meta_key}) == intval($b->fields->{$meta_key})) {
        return 0;
      }

      return (intval($a->fields->{$meta_key}) < intval($b->fields->{$meta_key})) ? -1 : 1;
    }
  }

  /**
   * gets forbidden categories
   * ---
   * sometimes we need to return al forbidden categories of all languages.
   * however suppressing the wpml filters doesn't work for some reason.
   * instead we have to get all wpml languages and switch between languages
   * to get all categories successfully.
   *
   * @param   string        $taxonomy      taxonomy name
   * @param   integer|bool  $user_id       user id or false
   * @param   bool          $suppress_wpml all languages
   *
   * @return  array                    array of forbidden category ids
   */
  private static function get_forbidden_categories($taxonomy, $user_id = false, $suppress_wpml = false) {
    if(!$user_id) {
      $user_id = 0;
    }

    if(isset(self::$forbidden_categories[$taxonomy][$user_id][$suppress_wpml])) {
      return self::$forbidden_categories[$taxonomy][$user_id][$suppress_wpml];
    }

    $forbidden_categories = [];
    $terms = [];
    $user_roles = self::get_user_roles($user_id);

    if($suppress_wpml) {
      $active_languages = apply_filters("wpml_active_languages", null, []);

      foreach($active_languages as $lang_code => $lang) {
        do_action("wpml_switch_language", $lang_code);

        $tmp_terms = get_terms([
          "taxonomy" => $taxonomy,
          "hide_empty" => false,
          "parent" => 0,
        ]);

        $terms = array_merge($terms, $tmp_terms);
      }
    } else {
      $terms = get_terms([
        "taxonomy" => $taxonomy,
        "hide_empty" => false,
        "parent" => 0,
      ]);
    }

    foreach ($terms as $term) {
      $excluded_roles = get_field("exclude_roles", $term);
      $child_terms = [];

      if($suppress_wpml) {
        foreach ($active_languages as $lang_code => $lang) {
          do_action("wpml_switch_language", $lang_code);

          $tmp_child_terms = get_terms([
            "taxonomy" => $taxonomy,
            "hide_empty" => true,
            "parent" => $term->term_id,
          ]);

          $child_terms = array_merge($child_terms, $tmp_child_terms);
        }
      } else {
        $child_terms = get_terms([
          "taxonomy" => $taxonomy,
          "hide_empty" => true,
          "parent" => $term->term_id,
        ]);
      }

      if (!empty($excluded_roles) && self::do_user_roles_match($excluded_roles, $user_id)) {
        $forbidden_categories[] = $term->term_id;

        foreach ($child_terms as $child_term) {
          $forbidden_categories[] = $child_term->term_id;
        }
      } else {
        foreach ($child_terms as $child_term) {
          $excluded_roles_child = get_field("exclude_roles", $child_term);

          if (!empty($excluded_roles_child) && self::do_user_roles_match($excluded_roles_child, $user_id)) {
            $forbidden_categories[] = $child_term->term_id;
          }
        }
      }
    }

    self::$forbidden_categories[$taxonomy][$user_id][$suppress_wpml] = $forbidden_categories;

    return self::$forbidden_categories[$taxonomy][$user_id][$suppress_wpml];
  }

  /**
   * @param $option_tag_key
   * @return mixed
   */
  private static function get_tags($option_tag_key) {
    $option = get_option(self::$option_key);
    $result = [];

    if (!isset($option[$option_tag_key]) || empty($option[$option_tag_key])) {
      return [];
    }

    foreach ($option[$option_tag_key] as $tag) {
      $sanitized_tag = sanitize_key($tag);
      $result[$sanitized_tag] = $tag;
    }

    return $result;
  }

  /**
   * get active languages
   *
   * @return  array  active wpml languages
   */
  private static function get_active_languages() {
    if(self::$languages === NULL) {
      self::$languages = apply_filters("wpml_active_languages", NULL, "orderby=id&order=desc");
    }

    return self::$languages;
  }
}

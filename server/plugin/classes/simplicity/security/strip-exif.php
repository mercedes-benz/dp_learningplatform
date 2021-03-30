<?php

namespace Simplicity\Security;

final class StripEXIF {
  public static function init() {
    add_action("wp_handle_upload", __CLASS__ . "::process_file", 10);
  }

  /**
   * process file if mime type matches
   *
   * @param   array  $upload  file upload array
   *
   * @return  array           filtered upload array
   */
  public static function process_file($upload) {
    if(empty($upload["file"])) return false;

    switch($upload["type"]) {
      case "image/jpeg":
        $upload["file"] = self::remove_exif(realpath($upload["file"]), "jpg");
        break;
      case "image/png":
        $upload["file"] = self::remove_exif(realpath($upload["file"]), "png");
        break;
    }

    return $upload;
  }

  /**
   * remove exif if possible
   *
   * @param   string  $path  upload path
   * @param   string  $ext   file extension
   *
   * @return  string         upload path
   */
  private static function remove_exif($path, $ext) {
    if(empty($path) || !is_admin() || !self::_gd_exists()) return $path;

    if($ext === "jpg") {
      $img = imagecreatefromjpeg($path);
      imagejpeg($img, $path, 100);
      imagedestroy($img);
    } elseif($ext === "png") {
      $img = imagecreatefrompng($path);
      imagepng($img, $path, 0);
      imagedestroy($img);
    }

    return $path;
  }

  /**
   * check if gd exists
   *
   * @return  bool
   */
  private static function _gd_exists() {
    return extension_loaded("gd") && function_exists("gd_info");
  }
}

<?php

namespace Simplicity\Security;

final class MediaAccess {

  protected static $request;

  /**
   * initialize
   * -----------
   * checks if query param "dps-media" exists and user is authorized,
   * outputs file or sends 403 header
   *
   * @return  mixed
   *
   * @access public
   */
  public static function init() {
    $media = self::getFromQuery("dps-media");

    if (is_numeric($media)) { // check if there is redirect query param
      $request = self::getFromServer("REQUEST_URI");
    } else {
      $request = $media;
    }

    self::$request = ltrim(preg_replace('/(\?.*|#)$/', '', $request), '/');

    if (!empty(self::$request)) {
      self::processFile();
    }
  }

  /**
   * process requested file
   * --------
   * outputs file if authorized or sends 403 header
   *
   * @return  mixed
   *
   * @access protected
   */
  protected static function processFile() {
    if (self::isAuthorized()) {
      $file_path = self::_getFileFullpath();

      self::outputFile($file_path);
    } else {
      http_response_code(403);
    }

    exit;
  }

  /**
   * output file
   *
   * @param   string  $path  path
   *
   * @return  mixed          output file
   *
   * @access protected
   */
  protected static function outputFile($path) {
    $path = realpath(rawurldecode($path));

    $mime = function_exists("mime_content_type") ? mime_content_type($path) : "application/octet-stream";

    header("Content-Type: {$mime}");
    if (isset($_SERVER["HTTP_RANGE"])) {
      self::outputRangeFile($path);
    } else {
      header("Content-Length: " . filesize($path));

      // Calculate etag
      $last_modified = gmdate('D, d M Y H:i:s', filemtime($path));
      $etag = '"' . md5($last_modified) . '"';

      header("Last-Modified: {$last_modified} GMT");
      header("ETag: {$etag}");
      header('Expires: ' . gmdate('D, d M Y H:i:s', time() + 100000000) . ' GMT');

      // Finally read the file
      readfile($path);
    }
  }

  /**
   * output range file
   *
   * @param   string  $path  path
   *
   * @return  mixed          output file range
   *
   * @access protected
   */
  protected static function outputRangeFile($path) {
    $fp = @fopen($path, 'rb');

    $size = filesize($path); // File size
    $length = $size; // Content length
    $start = 0; // Start byte
    $end = $size - 1; // End byte
    // Now that we've gotten so far without errors we send the accept range header
    /* At the moment we only support single ranges.
     * Multiple ranges requires some more work to ensure it works correctly
     * and comply with the spesifications: http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.2
     *
     * Multirange support annouces itself with:
     * header('Accept-Ranges: bytes');
     *
     * Multirange content must be sent with multipart/byteranges mediatype,
     * (mediatype = mimetype)
     * as well as a boundry header to indicate the various chunks of data.
     */
    header("Accept-Ranges: 0-$length");
    // header('Accept-Ranges: bytes');
    // multipart/byteranges
    // http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.2

    $c_start = $start;
    $c_end = $end;
    // Extract the range string
    list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2);
    // Make sure the client hasn't sent us a multibyte range
    if (strpos($range, ',') !== false) {

      // (?) Shoud this be issued here, or should the first
      // range be used? Or should the header be ignored and
      // we output the whole content?
      header('HTTP/1.1 416 Requested Range Not Satisfiable');
      header("Content-Range: bytes $start-$end/$size");
      // (?) Echo some info to the client?
      exit;
    }
    // If the range starts with an '-' we start from the beginning
    // If not, we forward the file pointer
    // And make sure to get the end byte if spesified
    if ($range0 == '-') {

      // The n-number of the last bytes is requested
      $c_start = $size - substr($range, 1);
    } else {

      $range = explode('-', $range);
      $c_start = $range[0];
      $c_end = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $size;
    }
    /* Check the range and make sure it's treated according to the specs.
     * http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
     */
    // End bytes can not be larger than $end.
    $c_end = ($c_end > $end) ? $end : $c_end;
    // Validate the requested range and return an error if it's not correct.
    if ($c_start > $c_end || $c_start > $size - 1 || $c_end >= $size) {

      header('HTTP/1.1 416 Requested Range Not Satisfiable');
      header("Content-Range: bytes $start-$end/$size");
      // (?) Echo some info to the client?
      exit;
    }

    $start = $c_start;
    $end = $c_end;
    $length = $end - $start + 1; // Calculate new content length
    fseek($fp, $start);
    header('HTTP/1.1 206 Partial Content');
    // Notify the client the byte range we'll be outputting
    header("Content-Range: bytes $start-$end/$size");
    header("Content-Length: $length");

    // Start buffered download
    $buffer = 1024 * 8;
    while (!feof($fp) && ($p = ftell($fp)) <= $end) {

      if ($p + $buffer > $end) {

        // In case we're only outputtin a chunk, make sure we don't
        // read past the length
        $buffer = $end - $p + 1;
      }
      set_time_limit(0); // Reset time limit for big files
      echo fread($fp, $buffer);
      flush(); // Free up memory. Otherwise large files will trigger PHP's memory limit.
    }

    fclose($fp);
  }

  /**
   * user is authorized
   *
   * @return  bool
   *
   * @access protected
   */
  protected static function isAuthorized() {
    return \get_current_user_id() > 0;
  }

  /**
   * Get data from the GET/Query
   *
   * @param string $param
   * @param int    $filter
   * @param int    $options
   *
   * @return mixed
   *
   * @access protected
   */
  protected static function getFromQuery($param, $filter = FILTER_DEFAULT, $options = null) {
    $get = filter_input(INPUT_GET, $param, $filter, $options);

    if (is_null($get)) {
      $get = filter_var(self::readFromArray($_GET, $param), $filter, $options);
    }

    return $get;
  }

  /**
   * Get data from the super-global $_SERVER
   *
   * @param string $param
   * @param int    $filter
   * @param int    $options
   *
   * @return mixed
   *
   * @access protected
   */
  protected static function getFromServer($param, $filter = FILTER_DEFAULT, $options = null) {
    $var = filter_input(INPUT_SERVER, $param, $filter, $options);

    // Cover the unexpected server issues (e.g. FastCGI may cause unexpected null)
    if (empty($var)) {
      $var = filter_var(
        self::readFromArray($_SERVER, $param), $filter, $options
      );
    }

    return $var;
  }

  /**
   * Check array for specified parameter and return the it's value or
   * default one
   *
   * @param array  $array   Global array _GET, _POST etc
   * @param string $param   Array Parameter
   * @param mixed  $default Default value
   *
   * @return mixed
   *
   * @access protected
   */
  protected static function readFromArray($array, $param, $default = null) {
    $value = $default;

    if (is_null($param)) {
      $value = $array;
    } else {
      $chunks = explode('.', $param);
      $value = $array;
      foreach ($chunks as $chunk) {
        if (isset($value[$chunk])) {
          $value = $value[$chunk];
        } else {
          $value = $default;
          break;
        }
      }
    }

    return $value;
  }

  /**
   * Compute correct physical location to the file
   *
   * @return string
   *
   * @access private
   */
  private static function _getFileFullpath() {
    // Get the sub dir path if website is located in subdirectory
    $sub_folder = ltrim(dirname(self::getFromServer('PHP_SELF')), '/');

    if (strpos(self::$request, $sub_folder . '/') === 0) {
      $request = substr(self::$request, strlen($sub_folder) + 1);
    } else {
      $request = self::$request;
    }

    return ABSPATH . $request;
  }
}

<?php
/*
Plugin Name: Daimler Protics SimpliCity
Description: Extension for Daimler Protics SimpliCity
Version: 2.5.6
Text Domain: dp
*/

define("DP_PLUGIN_BASE_FILE", __FILE__);
define("DP_PLUGIN_DIR", plugin_dir_path(__FILE__));
define("DP_PLUGIN_URL", plugin_dir_url(__FILE__));
define("DP_PLUGIN_VC_DIR", DP_PLUGIN_DIR . "classes/vc/");
define("DP_PLUGIN_VC_URL", DP_PLUGIN_URL . "vc/");

require_once "classes/simplicity/security/samesite-cookies.php";

require_once "classes/simplicity/helper.php";
require_once "classes/simplicity/migrations.php";
require_once "classes/simplicity/plugin.php";
require_once "classes/simplicity/install.php";

require_once "options/admin-init.php";

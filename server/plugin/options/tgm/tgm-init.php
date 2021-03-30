<?php

/**
 * TGM Init Class
 */
require_once "class-tgm-plugin-activation.php";

function register_required_plugins() {
	$plugins = [
		[
			"name" => "WPBakery Page Builder",
			"slug" => "wpbakery-page-builder",
			"required" => true,
			"force_activation" => true,
			"version" => "5.6",
			//"source" => DP_PLUGIN_URL . "/lib/visual-composer-page-builder-for-wordpress-wordpress-plugin.zip",
		],
		[
			"name" => "WPML",
			"slug" => "sitepress-multilingual-cms",
			"required" => true,
			"force_activation" => true,
			"version" => "4.1.4",
		],
		[
			"name" => "WPML String Translation",
			"slug" => "wpml-string-translation",
			"required" => true,
			"force_activation" => true,
			"version" => "2.9.2",
		],
		[
			"name" => "WPML CMS Nav",
			"slug" => "wpml-cms-nav",
			"required" => true,
			"force_activation" => true,
			"version" => "1.4.24",
		],
		[
			"name" => "WPML Translation Management",
			"slug" => "wpml-translation-management",
			"required" => true,
			"force_activation" => true,
			"version" => "2.7.3",
		],
		[
			"name" => "Advanced Custom Fields",
			"slug" => "advanced-custom-fields",
			"required" => true,
			"force_activation" => true,
			//"source" => DP_PLUGIN_URL . "/lib/advanced-custom-fields-pro.zip",
		],
		[
			"name" => "Relevanssi",
			"slug" => "relevanssi",
			"required" => true,
			"force_activation" => true,
		],
		[
			"name" => "JWT Authentication for WP REST API",
			"slug" => "jwt-authentication-for-wp-rest-api",
			"required" => true,
			"force_activation" => true,
		],
		[
			"name" => "WP User Avatar",
			"slug" => "wp-user-avatar",
			"required" => true,
			"force_activation" => true,
		],
		[
			"name" => "Duplicate Post",
			"slug" => "duplicate-post",
			"required" => true,
			"force_activation" => true,
		],
		[
			"name" => "SB Welcome Email Editor",
			"slug" => "welcome-email-editor",
			"required" => true,
			"force_activation" => true,
		],
		[
			"name" => "Enable Media Replace",
			"slug" => "enable-media-replace",
			"required" => true,
		],
		[
			"name" => "OAuth Client Enterprise",
			"slug" => "miniorange-oauth-client-enterprise",
			"required" => false,
			"version" => "37.0.0",
		],
		[
			"name" => "Oasis Workflow Pro",
			"slug" => "oasis-workflow-pro",
			"required" => false,
			"version" => "5.8",
		],
		[
			"name" => "Easy WP SMTP",
			"slug" => "easy-wp-smtp",
			"required" => false,
		],
		[
			"name" => "Loco Translate",
			"slug" => "loco-translate",
			"required" => false,
		],
		[
			"name" => "User Role Editor",
			"slug" => "user-role-editor",
			"required" => false,
		],
		[
			"name" => "Admin Menu Editor",
			"slug" => "admin-menu-restriction",
			"required" => false,
		],
	];

	$config = [
		"domain" => "dp",
		"default_path" => "",
		"parent_slug" => "plugins.php",
		"capability" => "manage_options",
		"menu" => "install-required-plugins",
		"has_notices" => true,
		"is_automatic" => true,
	];

	tgmpa($plugins, $config);
}

add_action( "tgmpa_register", "register_required_plugins" );

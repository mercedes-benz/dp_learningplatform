# Wordpress Backend Setup
## Server requirements

* Apache with mod_rewrite enabled or nginx
* [PHP](https://secure.php.net/) 7.3 or higher
* [MySQL](https://www.mysql.com/) 5.6 or higher / [MariaDB](https://mariadb.org/) 10.0 or higher
* SSL enabled (e.g. [Let's Encrypt](https://letsencrypt.org/getting-started/) using [Certbot](https://certbot.eff.org/docs/install.html#))

## Setup

Before install, ensure you have set up separate vhosts for the Wordpress installation and the client – right now they cannot share the same (sub-)domain. The client root directory must be set to `YOUR_REPO_PATH/client/build`.

1. [Install Wordpress](https://codex.wordpress.org/Installing_WordPress)
2. Symlink `./server/plugin` to `YOUR_WORDPRESS_FOLDER/wp-content/plugins/plugin`
3. Symlink `./server/theme` to `YOUR_WORDPRESS_FOLDER/wp-content/themes/theme`
4. Install theme (just a blank theme, so you won't see anything in frontned) and plugin in admin UI
5. Necessary and recommended plugins will be displayed after activating the plugin `<PROJECT_PLACEHOLDER>`. The necessary plugins are:
  * [Advanced Custom Fields](https://de.wordpress.org/plugins/advanced-custom-fields/)
  * [WPBakery Page Builder](https://codecanyon.net/item/visual-composer-page-builder-for-wordpress/242431)
  * [Relevanssi](https://de.wordpress.org/plugins/relevanssi/)
  * [JWT Authentification for WP REST API V2](https://de.wordpress.org/plugins/jwt-authentication-for-wp-rest-api/)
  * [WP User Avatar](https://de.wordpress.org/plugins/wp-user-avatar/)
6. Configure *Relevanssi* in `Settings > Relevanssi` so it indexes necessary posts.
  * Tab _Indexing_ &rarr; at post types check only **releases**, **learning** and **faq**
  * Tab _Indexing_ &rarr; at taxonomies check only **release_category**, **learning_topic** and **faq_category**
  * Tab _Indexing_ &rarr; check **Index the post excerpt**
  * Save settings
  * Click on `build index` at the top of the _Indexing_ tab
7. Configure *WPBakery Page Builder* in `WPBakery Page Builder > General settings`
  * Tab _Role manager_ &rarr; for each required role (mostly Administrators) set the option _Post types_ to **individual** and select **page**, **releases** and **learning**
  * Also set _Backend editor_ to **Enabled and default**
  * To prevent using the classic Wordpress editor, you can also check _Disable classic editor_
  * On _General Settings_ tab, you can also **Disable Gutenberg Editor**
8. In WordPress go to "Settings -> Permalinks" and choose "Post name" at "Common Settings", save changes.
9. Prepare your wordpress installation for JWT Authentification
  * Add following lines on top of your `.htaccess`
    ```
    <IfModule mod_rewrite.c>
    RewriteEngine on
    RewriteCond %{HTTP:Authorization} ^(.*)
    RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]
    </IfModule>
    ```

    For nginx add these lines to your `location /` block:
    ```
    proxy_set_header Authorization $http_authorization;
    proxy_pass_header  Authorization;
    ```
    and in the same block change the default line for `try_files` to:
    ```
    try_files $uri $uri/ /index.php?$args;
    ```

  * Add the following line to your `wp-config.php`
    ```
    define('JWT_AUTH_SECRET_KEY', 'your-top-secret-key');
    ```

    You can use a string from [here](https://api.wordpress.org/secret-key/1.1/salt/)
  * Add this line to enable CORS
    ```
    define('JWT_AUTH_CORS_ENABLE', true);
    ```
10. Set your frontend url in `wp-config.php`. This will be displayed in your backend login form for self care actions like resetting your password. _(temporary until self care will be implemented in react app))_
    ```
    define("DP_FRONTEND_URL", "YOUR_FRONTEND_URL");
    ```
11. Provide media access only to authorized users
    ```
    # Apache (.htaccess)
    <IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteCond %{REQUEST_URI} wp-content/uploads/(.*)$
    RewriteRule . /index.php?dps-media=1 [L]
    </IfModule>

    # nginx
    location ~* ^/wp-content/uploads/ {
      rewrite (?i)^(/wp-content/uploads/.*)$ /index.php?dps-media=$1 last;
      return 307;
    }
    ```
12. (optional) If you want to perform migrations after deployment, add the following command as the last build step.
    ```
    curl https://YOUR_BACKEND_HOST/wp-json/dp/v1/migrations/run
    ```

13. (optional) If you want to perform regular logins, add the following line to your `wp-config.php` or in docker-compose file
    ```
    define("DP_DEBUG_LOGIN", true);
    ```

    With this option you can log into backend with `http://YOUR_BACKEND_HOST/wp-login.php?oauthredirect=false`.
14. (option) To allow uploading archives (like .zip, .rar, ...), add the following line to your `wp-config.php`.
    ```
    define("DP_ALLOW_ARCHIVE_UPLOADS", true);
    ```

### Migrations

Migrations will be executed on the first visit of `BACKEND_HOST/wp-admin` or by calling the API endpoint `dp/v1/migrations/run`.

For easier testing of migrations, add this line to your `wp-config.php`:

```bash
define("DP_TEST_MIGRATION", true);
```

This will prevent setting the current plugin version in the dp option.


# Recommanded Plugin List 

This project is build with some commercial plugins. We try to replace them by free plugins as good as we can. Actually there are following plugins used:
| Plugin                                                          | Usage                                         |
|-----------------------------------------------------------------|-----------------------------------------------|
| acfml.1.0.4.zip                                                 |                                               |
| advanced-custom-fields-pro.zip                                  | Used for many custom fields e.g. Readingtime  |
| miniorange-oauth-client-enterprise.zip                          | Used for OIDC integration.                    |
| oasis-workflow-pro.zip                                          | Custom Workflows for authoring                |
| sitepress-multilingual-cms.4.1.4.zip                            | i18n                                          |
| visual-composer-page-builder-for-wordpress-wordpress-plugin.zip | This is used for content creating             |
| wpml-cms-nav.1.4.24.zip                                         |                                               |
| wpml-string-translation.2.9.2.zip                               |                                               |
| wpml-translation-management.2.7.3.zip                           |                                               |


## Known Issues

- Without the WPBakery Pagebuilder plugin it is not possible to create content.
- If the login without Daimler Account fails fetching, may the wp api is not working.Try setting Permalinks to "Post Name"
- The frontendclient does not consider a port number in the env.js. Change [ApiService](client/src/services/ApiService.js).


<?php
// Snippet from PHP Share: http://www.phpshare.org
if(!function_exists("human_filesize")) {
    function human_filesize($bytes, $precision = 1) {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        // Uncomment one of the following alternatives
        // $bytes /= pow(1024, $pow);
        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
;?>
<?php
extract(shortcode_atts([
  "style" => "cyan",
  "headline" => "",
  "text_col" => "",
], $atts));

$text_col = vc_param_group_parse_atts($text_col);
$siteURL = get_site_url();
?>
<?php if(is_array($text_col)): ?>
<div class="downloads downloads--<?php echo $style; ?> content_element">
  <div class="downloads__wrapper">
    <h3 class="downloads__headline"><?php echo $headline; ?></h3>
    <ul class="downloads__col">
      <?php foreach($text_col as $i): ?>
      <?php
        $file_picker_src = wp_get_attachment_url($i["file_picker"]);
        $file_size = get_attached_file($i["file_picker"]);
      ?>
      <li>
        <a class="link" href="<?= $file_picker_src ?>" download target="_blank">
          <span class="title"><?php echo $i["text_col_item"]; ?></span>
          <span class="size"><?= human_filesize(filesize($file_size)) ?></span>
          <span class="ico"><i class="icon-download"></i></span>
        </a>
      </li>
      <?php endforeach; ?>
    </ul>
  </div>
</div>
<?php endif; ?>

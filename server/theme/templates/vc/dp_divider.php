<?php
extract(shortcode_atts([
  "margins" => "no-margin",
], $atts));
?>
<div class="divider <?php echo $margins; ?>"></div>
